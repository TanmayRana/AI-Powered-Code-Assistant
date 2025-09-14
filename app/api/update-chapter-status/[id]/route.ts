import connectDB from "@/lib/mongodb";
import ChapterNodes from "@/lib/MongoSchemas/chapterNodes";
import { NextResponse } from "next/server";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    const doc = await ChapterNodes.findByIdAndUpdate(
      id,
      { $set: { status: "Ready" } },
      { new: true }
    );

    if (!doc) {
      return NextResponse.json(
        { error: "Chapter document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Chapter status updated successfully",
      chapter: doc,
    });
  } catch (error: any) {
    console.error("Error updating chapter status:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message },
      { status: 500 }
    );
  }
}
