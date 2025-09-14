import connectDB from "@/lib/mongodb";
import LessonMaterials from "@/lib/MongoSchemas/LessonMaterials";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId");

    if (!lessonId) {
      return NextResponse.json(
        { error: "Lesson ID is required as query parameter" },
        { status: 400 }
      );
    }

    // console.log("Testing lesson status for lessonId:", lessonId);

    // Find the lesson material
    const lesson = await LessonMaterials.findById(lessonId);

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson material not found" },
        { status: 404 }
      );
    }

    // console.log("Found lesson:", {
    //   id: lesson._id,
    //   status: lesson.status,
    //   topic: lesson.topic,
    //   createdAt: lesson.createdAt,
    //   updatedAt: lesson.updatedAt
    // });

    return NextResponse.json({
      message: "Lesson material found",
      lesson: {
        id: lesson._id,
        status: lesson.status,
        topic: lesson.topic,
        createdAt: lesson.createdAt,
        updatedAt: lesson.updatedAt,
        schema: Object.keys(lesson.toObject()),
      },
    });
  } catch (error: any) {
    console.error("Error testing lesson status:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error?.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await connectDB();

  try {
    const { lessonId, newStatus } = await request.json();

    if (!lessonId || !newStatus) {
      return NextResponse.json(
        { error: "Lesson ID and new status are required" },
        { status: 400 }
      );
    }

    // console.log("Testing status update for lessonId:", lessonId, "to status:", newStatus);

    // Find the lesson material first
    const existingLesson = await LessonMaterials.findById(lessonId);

    if (!existingLesson) {
      return NextResponse.json(
        { error: "Lesson material not found" },
        { status: 404 }
      );
    }

    // console.log("Current lesson status:", existingLesson.status);

    // Update the status
    const updatedLesson = await LessonMaterials.findByIdAndUpdate(
      lessonId,
      {
        status: newStatus,
        updatedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedLesson) {
      return NextResponse.json(
        { error: "Failed to update lesson material" },
        { status: 500 }
      );
    }

    // console.log("Lesson material status updated successfully to:", updatedLesson.status);

    return NextResponse.json({
      message: "Lesson material status updated successfully",
      lessonId: updatedLesson._id,
      oldStatus: existingLesson.status,
      newStatus: updatedLesson.status,
      updated: true,
    });
  } catch (error: any) {
    console.error("Error testing lesson status update:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error?.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
