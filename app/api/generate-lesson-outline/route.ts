// pages/api/generate-course.ts

import { inngest } from "@/inngest/client";
import { system_prompt } from "@/lib/Constants";
import {
  GetgenerateContent,
  GetgenerateContentWithFallback,
} from "@/lib/GetgenerateContent";
import connectDB from "@/lib/mongodb";
import LessonMaterials from "@/lib/MongoSchemas/LessonMaterials";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  await connectDB();
  try {
    const body = await request.json();
    const { topic, difficulty = "Medium", purpose = "Comprehensive" } = body;

    const user = await currentUser();
    const userEmail = user?.emailAddresses[0].emailAddress;

    if (!topic) {
      return new Response(JSON.stringify({ error: "Topic is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Replace placeholders dynamically
    const final_prompt = system_prompt
      .replace(/\[Topic Name\]/g, topic)
      .replace(/\[difficulty_level\]/g, difficulty)
      .replace(/\[study_type\]/g, purpose);

    let response: string;

    try {
      // Try with primary model first
      response = await GetgenerateContent(final_prompt);
    } catch (error: any) {
      console.log("Primary model failed, trying fallback...");

      // If primary fails, try with fallback model
      try {
        response = await GetgenerateContentWithFallback(final_prompt);
      } catch (fallbackError: any) {
        // Both models failed
        console.error("Both primary and fallback models failed:", {
          primary: error.message,
          fallback: fallbackError.message,
        });

        // Check if it's a service overload error
        if (
          error.message?.includes("overloaded") ||
          error.message?.includes("Service Unavailable")
        ) {
          return new Response(
            JSON.stringify({
              error:
                "AI service is currently overloaded. Please try again in a few minutes.",
              details:
                "The AI service is experiencing high demand. We've automatically retried your request multiple times.",
              retryable: true,
              suggestedDelay: 60000,
            }),
            {
              status: 503,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        // Other types of errors
        return new Response(
          JSON.stringify({
            error: "Failed to generate lesson outline. Please try again later.",
            details:
              "We encountered an issue with the AI service. Please try again in a few minutes.",
            retryable: true,
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    if (!response || !response.trim()) {
      return new Response(
        JSON.stringify({ error: "Empty response from AI service" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let roadmap;
    try {
      const match = response.match(/```json\s*([\s\S]*?)\s*```/i);
      const jsonString = match ? match[1] : response.trim();
      roadmap = JSON.parse(jsonString);
    } catch (err) {
      console.error("Failed to parse AI response:", err);
      roadmap = { error: "Invalid AI JSON output" };
    }

    // save the output to the database
    const createlesson = await LessonMaterials.create({
      purpose,
      topic,
      difficulty,
      lessons: roadmap,
      userEmail: userEmail,
      aiAgentType: "ai-lesson-agent",
    });

    // console.log("createlesson", createlesson);

    await inngest.send({
      name: "ai/generate-notes",
      data: {
        course: createlesson,
      },
    });

    return new Response(JSON.stringify(createlesson._id), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error(err);

    // Handle specific error types
    if (
      err.message?.includes("overloaded") ||
      err.message?.includes("Service Unavailable")
    ) {
      return new Response(
        JSON.stringify({
          error:
            "AI service is currently overloaded. Please try again in a few minutes.",
          details: err.message,
          retryable: true,
          suggestedDelay: 60000,
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        error: err.message || "Internal Server Error",
        retryable: false,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
