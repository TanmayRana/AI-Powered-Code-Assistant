import connectDB from "@/lib/mongodb";
import LessonMaterials from "@/lib/MongoSchemas/LessonMaterials";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId");

    if (lessonId) {
      // Get specific lesson material
      const lesson = await LessonMaterials.findById(lessonId);

      if (!lesson) {
        return NextResponse.json(
          { error: "Lesson material not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "Lesson material found",
        lesson: {
          id: lesson._id,
          purpose: lesson.purpose,
          topic: lesson.topic,
          difficulty: lesson.difficulty,
          status: lesson.status,
          userEmail: lesson.userEmail,
          aiAgentType: lesson.aiAgentType,
          createdAt: lesson.createdAt,
          updatedAt: lesson.updatedAt,
          schema: Object.keys(lesson.toObject()),
        },
      });
    } else {
      // Get all lesson materials with status info
      const lessons = await LessonMaterials.find({})
        .select("_id purpose topic status createdAt updatedAt")
        .limit(10);

      const statusCounts = await LessonMaterials.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      return NextResponse.json({
        message: "Lesson materials overview",
        totalCount: lessons.length,
        statusCounts,
        recentLessons: lessons.map((lesson: any) => ({
          id: lesson._id,
          purpose: lesson.purpose,
          topic: lesson.topic,
          status: lesson.status,
          createdAt: lesson.createdAt,
          updatedAt: lesson.updatedAt,
        })),
      });
    }
  } catch (error: any) {
    console.error("Error debugging lesson materials:", error);
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

    // Test different update methods
    let updateResult = null;
    let method = "";

    // Method 1: findByIdAndUpdate
    try {
      updateResult = await LessonMaterials.findByIdAndUpdate(
        lessonId,
        { status: newStatus, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      method = "findByIdAndUpdate";
    } catch (error) {
      console.error("Method 1 failed:", error);
    }

    // Method 2: updateOne if first failed
    if (!updateResult) {
      try {
        const result = await LessonMaterials.updateOne(
          { _id: lessonId },
          { status: newStatus, updatedAt: new Date() }
        );
        if (result.modifiedCount > 0) {
          updateResult = await LessonMaterials.findById(lessonId);
          method = "updateOne";
        }
      } catch (error) {
        console.error("Method 2 failed:", error);
      }
    }

    // Method 3: save() if other methods failed
    if (!updateResult) {
      try {
        existingLesson.status = newStatus;
        existingLesson.updatedAt = new Date();
        updateResult = await existingLesson.save();
        method = "save";
      } catch (error) {
        console.error("Method 3 failed:", error);
      }
    }

    if (!updateResult) {
      return NextResponse.json(
        { error: "All update methods failed" },
        { status: 500 }
      );
    }

    // Verify the update
    const verificationLesson = await LessonMaterials.findById(lessonId);

    return NextResponse.json({
      message: "Lesson material status updated successfully",
      lessonId: updateResult._id,
      oldStatus: existingLesson.status,
      newStatus: updateResult.status,
      method: method,
      verified: verificationLesson?.status === newStatus,
      verificationStatus: verificationLesson?.status,
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
