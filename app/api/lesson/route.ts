// import connectDB from "@/lib/mongodb";
// import LessonMaterials from "@/lib/MongoSchemas/LessonMaterials";

// export async function GET(request: Request) {
//   const { userEmail } = await request.json();
//   try {
//     await connectDB();
//     const lessons = await LessonMaterials.find({ userEmail }).sort({
//       createdAt: -1,
//     });
//     return Response.json(lessons);
//   } catch (error: any) {
//     return Response.json(
//       { error: error.message || "Failed to fetch lessons" },
//       { status: 500 }
//     );
//   }
// }

import connectDB from "@/lib/mongodb";
import LessonMaterials from "@/lib/MongoSchemas/LessonMaterials";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userEmail } = await request.json();

    if (!userEmail) {
      return NextResponse.json(
        { error: "userEmail is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const lessons = await LessonMaterials.find({ userEmail }).sort({
      createdAt: -1,
    });

    return NextResponse.json(lessons, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}
