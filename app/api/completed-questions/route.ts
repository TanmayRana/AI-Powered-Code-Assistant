import connectDB from "@/lib/mongodb";
import CompleteQuestions from "@/lib/MongoSchemas/completequstions";
import { NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnect";
// import CompleteQuestions from "@/models/CompleteQuestions";

// ✅ GET: fetch user progress
export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const data = await CompleteQuestions.findOne({ userId });
  return NextResponse.json(data || { userId, completedQuestions: [] });
}

// ✅ PATCH: toggle a question
export async function PATCH(req: Request) {
  await connectDB();
  const body = await req.json();
  const { userId, sheetId, questionId, completed } = body;

  if (!userId || !sheetId || !questionId) {
    return NextResponse.json(
      { error: "userId, sheetId, and questionId are required" },
      { status: 400 }
    );
  }

  let user = await CompleteQuestions.findOne({ userId });
  if (!user) {
    user = new CompleteQuestions({
      userId,
      completedQuestions: [
        {
          sheetId,
          questions: [{ questionId, completed }],
          completedCount: completed ? 1 : 0,
        },
      ],
    });
  } else {
    let sheet = user.completedQuestions.find((s: any) => s.sheetId === sheetId);
    if (!sheet) {
      sheet = {
        sheetId,
        questions: [{ questionId, completed }],
        completedCount: completed ? 1 : 0,
      };
      user.completedQuestions.push(sheet);
    } else {
      let question = sheet.questions.find(
        (q: any) => q.questionId === questionId
      );
      if (!question) {
        sheet.questions.push({ questionId, completed });
      } else {
        question.completed = completed;
      }
      sheet.completedCount = sheet.questions.filter(
        (q: any) => q.completed
      ).length;
    }
  }

  await user.save();
  return NextResponse.json(user);
}
