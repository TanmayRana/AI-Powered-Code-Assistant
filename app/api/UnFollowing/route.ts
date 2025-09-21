import connectDB from "@/lib/mongodb";
import Following from "@/lib/MongoSchemas/FollowingModel";
import Sheet from "@/lib/MongoSchemas/Sheet";
import { fetchSheets } from "@/lib/slices/sheetSlice";

export const POST = async (req: Request) => {
  try {
    await connectDB(); // Ensure DB connection

    const { userId, unfollowedSheetId } = await req.json();
    // console.log("UserID:", userId, "Unfollowed Sheet ID:", unfollowedSheetId);

    if (!userId || !unfollowedSheetId) {
      return new Response(JSON.stringify({ message: "Invalid input" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }



    // Find and update the Following collection
    const followedData = await Following.findOneAndUpdate(
      { userId },
      { $pull: { followedSheetIds: unfollowedSheetId } },
      { new: true } // Returns the updated document
    );

    if (!followedData) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

  

    return new Response(
      JSON.stringify({
        message: "Unfollowed sheet successfully",
        modifiedCount: followedData,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error unfollowing sheet:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
