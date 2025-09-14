import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import FullSheet from "@/lib/MongoSchemas/publicSheet";
import Sheet from "@/lib/MongoSchemas/Sheet";

// POST /api/sheet
export async function POST(request: Request) {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Slug is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Step 1: Find the sheet by slug
    const sheetDoc = await Sheet.findOne({ slug });
    if (!sheetDoc) {
      return NextResponse.json(
        { success: false, message: "Sheet not found" },
        { status: 404 }
      );
    }
    // console.log("✅ Sheet found:", sheetDoc._id, sheetDoc.slug);

    // Step 2: Try FullSheet by sheet._id
    let response = await FullSheet.findOne({ sheet: sheetDoc._id }).populate([
      { path: "sheet" },
      { path: "questions.questionId" },
    ]);

    // Step 3: Fallback - maybe FullSheet stored slug instead of ObjectId
    if (!response) {
      console.warn(
        "⚠️ FullSheet not found by sheet._id, trying slug fallback…"
      );
      response = await FullSheet.findOne({ slug }).populate([
        { path: "sheet" },
        { path: "questions.questionId" },
      ]);
    }

    if (!response) {
      console.error("❌ FullSheet still not found");
      return NextResponse.json(
        { success: false, message: "FullSheet not found" },
        { status: 404 }
      );
    }

    // console.log("✅ FullSheet found:", response._id);

    return NextResponse.json(
      { success: true, message: "Sheet Data Fetched", data: response },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error fetching sheet:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
