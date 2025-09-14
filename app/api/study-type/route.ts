import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ChapterNodes from "@/lib/MongoSchemas/chapterNodes";
import StudyTypeContents from "@/lib/MongoSchemas/studyTypeContents";

// POST /api/study-type
export async function POST(req: Request) {
  await connectDB();
  try {
    const { courseId, studyType } = await req.json();

    if (studyType === "ALL") {
      const notes = await ChapterNodes.find({ courseId }).sort({
        chapterId: 1,
      });
      const contentList = await StudyTypeContents.find({
        lessonId: courseId,
      }).sort({ chapterId: 1 });
      return NextResponse.json(
        {
          notes,
          flashcard: contentList.filter(
            (c: any) => c.studyType === "flashcard"
          ),
          quiz: contentList.filter((c: any) => c.studyType === "quiz"),
          qa: contentList.filter((c: any) => c.studyType === "qa"),
        },
        { status: 200 }
      );
    }

    if (studyType === "notes") {
      const notes = await ChapterNodes.find({ courseId }).sort({
        chapterId: 1,
      });
      return NextResponse.json(notes, { status: 200 });
    }

    const result = await StudyTypeContents.find({
      lessonId: courseId,
      studyType,
    }).sort({ chapterId: 1 });
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
