import connectDB from "@/lib/mongodb";
import DailyQuestion from "@/lib/MongoSchemas/dailyqustion";

import axios from "axios";

export async function GET() {
  await connectDB();

  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Check if today's data exists
    const existing = await DailyQuestion.findOne({ date: today });
    if (existing) {
      // Return existing data as JSON
      return new Response(JSON.stringify(existing), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      const res = await axios.get(`${process.env.HOST_URL}/api/dailt-challeng`);
      const results = res.data.results;

      await DailyQuestion.deleteMany({});

      const newData = await DailyQuestion.create({ date: today, results });

      return new Response(JSON.stringify(newData), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error in GET /daily-question:", error);
    return new Response(
      JSON.stringify({ error: "Failed to get daily question" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
