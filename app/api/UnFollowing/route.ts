import connectDB from "@/lib/mongodb";
import Following from "@/lib/MongoSchemas/FollowingModel";
import Sheet from "@/lib/MongoSchemas/Sheet";

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

    // Ensure unfollowedSheetId is an ObjectId
    // const unfollowedSheetObjectId = new mongoose.Types.ObjectId(
    //   unfollowedSheetId
    // );

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

    // if (!followedData.followings.includes(unfollowedSheetObjectId)) {
    //   return new Response(
    //     JSON.stringify({ message: "Sheet not found in followings" }),
    //     { status: 404, headers: { "Content-Type": "application/json" } }
    //   );
    // }

    // Update the followers count in PublicSheets
    const updateResult = await Sheet.updateOne(
      { _id: unfollowedSheetId },
      { $inc: { followers: -1 }, $set: { isFollowing: false } }
    );

    if (updateResult.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ message: "Failed to update public sheets" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Unfollowed sheet successfully",
        modifiedCount: updateResult.modifiedCount,
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
