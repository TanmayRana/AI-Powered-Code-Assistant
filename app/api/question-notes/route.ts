// app/api/question-notes/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import QuestionNotes from "@/lib/MongoSchemas/QuestionNotes";

connectDB();

// CREATE or UPDATE a note by userId + questionId
export async function POST(request: NextRequest) {
  try {
    const { questionId, userId, notes } = await request.json();

    if (!questionId || !userId || !notes) {
      return NextResponse.json(
        { message: "questionId, userId, and notes are required." },
        { status: 400 }
      );
    }

    // Check if note exists
    const existingNote = await QuestionNotes.findOne({ userId, questionId });

    let savedNote;
    if (existingNote) {
      existingNote.notes = notes;
      savedNote = await existingNote.save();
      return NextResponse.json(
        { message: "Note updated", data: savedNote },
        { status: 200 }
      );
    } else {
      savedNote = await QuestionNotes.create({ userId, questionId, notes });
      return NextResponse.json(
        { message: "Note created", data: savedNote },
        { status: 201 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to save note", error: error.message },
      { status: 500 }
    );
  }
}

// READ notes by userId or questionId
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const questionId = searchParams.get("questionId");

    const query: any = {};
    if (userId) query.userId = userId;
    if (questionId) query.questionId = questionId;

    console.log("Query:", query);

    const notes = await QuestionNotes.find(query).lean();
    return NextResponse.json({ data: notes }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch notes", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE note by userId + questionId
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const questionId = searchParams.get("questionId");

    if (!userId || !questionId) {
      return NextResponse.json(
        { message: "userId and questionId are required" },
        { status: 400 }
      );
    }

    const deletedNote = await QuestionNotes.findOneAndDelete({
      userId,
      questionId,
    });

    if (!deletedNote) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Note deleted", data: deletedNote },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to delete note", error: error.message },
      { status: 500 }
    );
  }
}
