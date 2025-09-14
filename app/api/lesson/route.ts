import connectDB from "@/lib/mongodb";
import LessonMaterials from "@/lib/MongoSchemas/LessonMaterials";

export async function GET(request: Request) {
  try {
    await connectDB();
    const lessons = await LessonMaterials.find().sort({ createdAt: -1 });
    return Response.json(lessons);
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}
