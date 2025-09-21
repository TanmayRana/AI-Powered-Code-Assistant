import connectDB from "@/lib/mongodb";
import Sheet from "@/lib/MongoSchemas/Sheet";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const sheets = await Sheet.find({ isFollowing: true }).lean();
    return NextResponse.json({ sheets }, { status: 200 });
  } catch (error) {
    console.error("Error fetching sheets:", error);
    return NextResponse.json(
      { message: "Error fetching sheets" },
      { status: 500 }
    );
  }
}
