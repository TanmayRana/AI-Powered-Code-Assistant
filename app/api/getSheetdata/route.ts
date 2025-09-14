import connectDB from "@/lib/mongodb";
import Sheet from "@/lib/MongoSchemas/Sheet";

export async function GET(request: Request) {
  await connectDB();
  try {
    const res = await Sheet.find({}).lean();
    return Response.json({ data: res });
  } catch (error) {
    return Response.json("Error fetching sheet data", { status: 500 });
  }
}
