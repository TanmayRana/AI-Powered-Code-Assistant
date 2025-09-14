// import axios from "axios";

// const FullSheetsData = async () => {
//   try {
//     // console.log("Fetching data for tag:", tag);
//     const response = await axios.get(`/api/getFullSheetdata/`);
//     console.log("Response data:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching public sheets data:", error);
//   }
// };

// const FullSheetsDataService = {
//   FullSheetsData,
// };

// export default FullSheetsDataService;

// import axios from "axios";

// const FullSheetsData = async ({ slug }: any) => {
//   try {
//     const response = await axios.post("/api/getFullSheetdata", { slug });

//     return response.data.data;
//   } catch (error) {
//     console.error("Error fetching public sheets data:", error);
//     throw error; // Rethrow the error to handle it elsewhere if needed
//   }
// };

// const FullSheetsDataService = {
//   fetchFullSheetsData: FullSheetsData, // Renaming for clarity
// };

// export default FullSheetsDataService;

import axios from "axios";

const FullSheetsData = async (slug: string) => {
  try {
    const response = await axios.post("/api/getFullSheetdata", { slug });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching full sheet data:", error);
    throw error;
  }
};

const FullSheetsDataService = {
  fetchFullSheetsData: FullSheetsData,
};

export default FullSheetsDataService;

// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import FullSheet from "../MongoSchemas/publicSheet";
// import axios from "axios";
// // import { FullSheet } from "@/lib/MongoSchemas/publicSheet";
// // import Question from "@/lib/MongoSchemas/Question"; // 👈 ensures model is registered

// export async function POST(request: Request) {
//   try {
//     const { slug } = await request.json();

//     if (!slug) {
//       return NextResponse.json(
//         { success: false, message: "Slug is required" },
//         { status: 400 }
//       );
//     }

//     // await connectDB();

//     // const response = await FullSheet.findOne({ "sheet.slug": slug }).populate(
//     //   "questions.questionId",
//     //   "_id name problemUrl difficulty" // pick fields you need
//     // );

//     // if (!response) {
//     //   return NextResponse.json(
//     //     { success: false, message: "Sheet not found" },
//     //     { status: 404 }
//     //   );
//     // }
//     const response = await axios.post("/api/getFullSheetdata", { slug });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Sheet Data Fetched",
//         data: response.data.data,
//       },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error("Error fetching sheets:", error);
//     return NextResponse.json(
//       { success: false, message: "Something went wrong", error: error.message },
//       { status: 500 }
//     );
//   }
// }
