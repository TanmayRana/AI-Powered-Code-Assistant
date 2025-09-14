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

    // Update `followers` count & `ifFollowed` for only the sheets being followed
    const updatedSheets = await Sheet.updateMany(
      { _id: { $in: followedSheetIds } },
      { $inc: { followers: 1 }, $set: { isFollowing: true } }
    );

    // console.log(`Updated ${updatedSheets} public sheets`);

    // publicSheetsData();
    // fetchFullSheetsData();

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

// export const GET = async (req: NextRequest) => {
//   try {
//     await dbConnect(); // Connect to the MongoDB database

//     // Extract the userId from the URL's query parameters
//     const userId = req.nextUrl.searchParams.get("userId");
//     console.log("userId", userId);

//     // Log the userId for debugging purposes
//     console.log("DEBUG: Fetching followed sheets for UserID:", userId);

//     // Validate that userId is provided
//     if (!userId) {
//       return NextResponse.json(
//         { message: "User ID is required" },
//         { status: 400 }
//       );
//     }

//     // Find the following document for the given userId
//     const userFollowing = await Following.findOne({ userId });

//     // If no following record is found for the user, return an empty array
//     if (!userFollowing) {
//       console.log("DEBUG: No following record found for user:", userId);
//       return NextResponse.json(
//         {
//           followedSheets: [],
//           message: "No sheets being followed by this user",
//         },
//         { status: 200 }
//       );
//     }

//     // Extract the array of followed sheet IDs from the found document
//     const followedSheetIds: string[] = userFollowing.followedSheetIds;

//     // Log the raw followed sheet IDs for debugging
//     console.log(
//       "DEBUG: Raw followed sheet IDs from Following model:",
//       followedSheetIds
//     );

//     // Convert string IDs to Mongoose ObjectId instances,
//     // and only convert if the string is a valid ObjectId.
//     const objectIds = followedSheetIds
//       .filter((id: string) => {
//         const isValid = Types.ObjectId.isValid(id);
//         if (!isValid) {
//           console.warn(
//             `WARN: Invalid ObjectId found in followedSheetIds (will be filtered out): ${id}`
//           );
//         }
//         return isValid;
//       })
//       .map((id: string) => new Types.ObjectId(id));

//     // Log the processed objectIds array to verify its content
//     console.log(
//       "DEBUG: Processed objectIds for PublicSheets query:",
//       objectIds
//     );
//     console.log("DEBUG: Number of valid objectIds:", objectIds.length);

//     // If there are no valid ObjectIds to query, return an empty array immediately
//     if (objectIds.length === 0) {
//       console.log(
//         "DEBUG: No valid ObjectIds to query for public sheets. Returning empty array."
//       );
//       return NextResponse.json(
//         {
//           followedSheets: [],
//           message: "No valid sheets found to follow.",
//         },
//         { status: 200 }
//       );
//     }

//     // --- DEEPER DEBUGGING FOR PUBLIC SHEETS FETCH ---

//     // 1. Log the collection name being used by the PublicSheets model
//     console.log(
//       "DEBUG: PublicSheetsModel is connected to collection:",
//       PublicSheets.collection.name
//     );

//     // 2. Count total documents in PublicSheets to see if the collection is even populated
//     const totalPublicSheetsCount = await PublicSheets.countDocuments({});
//     console.log(
//       "DEBUG: Total documents in PublicSheets collection:",
//       totalPublicSheetsCount
//     );
//     if (totalPublicSheetsCount === 0) {
//       console.warn(
//         "WARN: PublicSheets collection appears to be empty. This might be why no data is returned."
//       );
//     }

//     // 3. Try fetching one of the sheets directly by ID (if objectIds is not empty)
//     if (objectIds.length > 0) {
//       const testObjectId = objectIds[0];
//       console.log("DEBUG: Attempting direct findById for:", testObjectId);
//       const testSheet = await PublicSheets.findById(testObjectId).lean();
//       if (testSheet) {
//         console.log(
//           "DEBUG: Direct findById successful for first ID. Found:",
//           testSheet._id
//         );
//       } else {
//         console.warn(
//           "WARN: Direct findById failed for first ID. Document not found for:",
//           testObjectId
//         );
//       }
//     }

//     // --- END DEEPER DEBUGGING ---

//     // Find public sheets where their _id is in the list of valid objectIds.
//     const publicSheets = await PublicSheets.find({
//       _id: { $in: objectIds },
//     }).lean();

//     // Log the count of fetched public sheets
//     console.log(
//       "DEBUG: Fetched public sheets count (final query):",
//       publicSheets.length
//     );
//     // Log the fetched public sheets data (first 5 items for brevity if many)
//     console.log(
//       "DEBUG: Fetched public sheets data (first 5 items):",
//       publicSheets.slice(0, 5)
//     );

//     // Return the fetched public sheets as a JSON response
//     return NextResponse.json(
//       {
//         followedSheets: publicSheets,
//         message: "Followed sheets fetched successfully",
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     // Catch any errors that occur during the process and return a 500 status
//     console.error("ERROR: Error fetching followed sheets:", error);
//     return NextResponse.json(
//       { message: "Error fetching followed sheets" },
//       { status: 500 }
//     );
//   }
// };

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
