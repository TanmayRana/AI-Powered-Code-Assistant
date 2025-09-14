import connectDB from "@/lib/mongodb";
import User from "@/lib/MongoSchemas/user";

export async function POST(request: Request) {
  const { email, fullName, imageUrl, clerkId } = await request.json();
  await connectDB();
  try {
    const user = await User.findOne({ email });
    if (user) {
      return Response.json({ message: "User already exists" });
    }
    const newUser = await User.create({ email, fullName, imageUrl, clerkId });
    return Response.json(newUser);
  } catch (error) {
    return Response.json({ message: "Error creating user" }, { status: 500 });
  }
}
