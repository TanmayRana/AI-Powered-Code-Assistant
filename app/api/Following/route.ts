import connectDB from "@/lib/mongodb";
import Following from "@/lib/MongoSchemas/FollowingModel";
import Sheet from "@/lib/MongoSchemas/Sheet";
import { fetchSheets } from "@/lib/slices/sheetSlice";
// import { fetchFullSheetsData } from "@/lib/slices/fullSheetsSlice";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const { userId, followedSheetIds } = await req.json();

    // console.log("UserID:", userId, "Followed Sheet IDs:", followedSheetIds);

    if (
      !userId ||
      !Array.isArray(followedSheetIds) ||
      followedSheetIds.length === 0
    ) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    // Find existing following record for the user
    const existingFollowing = await Following.findOne({ userId });

    if (existingFollowing) {
      // Avoid duplicates
      const newFollowedSheetIds = Array.from(
        new Set([...existingFollowing.followedSheetIds, ...followedSheetIds])
      );

      // Update followedSheetIds
      await Following.updateOne(
        { userId },
        { followedSheetIds: newFollowedSheetIds }
      );
    } else {
      // Create a new following document
      await Following.create({ userId, followedSheetIds });
    }

    fetchSheets();

    return NextResponse.json(
      { message: "Following created or updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating or updating following:", error);
    return NextResponse.json(
      { message: "Error creating or updating following" },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectDB(); // Connect to the MongoDB database

    const userId = req.nextUrl.searchParams.get("userId");
    // console.log("userId", userId);

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    const userFollowing = await Following.findOne({ userId });

    if (!userFollowing) {
      // If a user has no 'Following' document, it means they are not following any sheets.
      // Return an empty array of followed sheets.
      return NextResponse.json(
        { message: "User not following any sheets", followedSheets: [] },
        { status: 200 }
      );
    }

    const followedSheetIds: string[] = userFollowing.followedSheetIds.map(
      (id: any) => id.toString()
    );
    // console.log("followedSheetIds", followedSheetIds);

    // Optimized approach: Fetch only the public sheets that are followed by the user
    const followedSheets = await Sheet.find({
      _id: { $in: followedSheetIds },
    }).lean();

    // console.log("Followed sheets:", followedSheets);

    return NextResponse.json(
      {
        sheets: followedSheets,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching followed sheets:", error);
    return NextResponse.json(
      { message: "Error fetching followed sheets" },
      { status: 500 }
    );
  }
};
