import connectDB from "@/lib/mongodb";
import LessonMaterials from "@/lib/MongoSchemas/LessonMaterials";

// ✅ GET lesson by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  // console.log("params", params);

  await connectDB();
  try {
    const lesson = await LessonMaterials.findById(params.id);
    if (!lesson) {
      return Response.json({ error: "Lesson not found" }, { status: 404 });
    }
    return Response.json(lesson, { status: 200 });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to fetch lesson" },
      { status: 500 }
    );
  }
}

// ✅ DELETE lesson by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  try {
    const lesson = await LessonMaterials.findByIdAndDelete(params.id);
    if (!lesson) {
      return Response.json({ error: "Lesson not found" }, { status: 404 });
    }
    return Response.json(
      { message: "Lesson deleted successfully", lesson },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to delete lesson" },
      { status: 500 }
    );
  }
}
