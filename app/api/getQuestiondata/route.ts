// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import Question from "@/lib/MongoSchemas/Question";

// export async function GET(request: Request) {
//   try {
//     // Parse query params from request.url
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get("id");

//     if (!id) {
//       return NextResponse.json(
//         { success: false, message: "id query parameter is required" },
//         { status: 400 }
//       );
//     }

//     await connectDB();

//     // Find question by _id
//     const question = await Question.findById(id);

//     if (!question) {
//       return NextResponse.json(
//         { success: false, message: "Question not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { success: true, data: question },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error("Error fetching question:", error);
//     return NextResponse.json(
//       { success: false, message: "Something went wrong", error: error.message },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Question from "@/lib/MongoSchemas/Question";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "id query parameter is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const question = await Question.findById(id);

    if (!question) {
      return NextResponse.json(
        { success: false, message: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: question },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching question:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
