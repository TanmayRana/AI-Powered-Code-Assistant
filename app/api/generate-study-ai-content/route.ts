import { NextResponse } from "next/server";
import {
  GetgenerateContent,
  GetgenerateContentWithFallback,
} from "@/lib/GetgenerateContent";

export async function POST(request: Request) {
  try {
    const { prompt, studyType } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    let aiContent: string;

    try {
      // Try with primary model first
      aiContent = await GetgenerateContent(prompt);
    } catch (error: any) {
      // console.log("Primary model failed, trying fallback...");

      // If primary fails, try with fallback model
      try {
        aiContent = await GetgenerateContentWithFallback(prompt);
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
          return NextResponse.json(
            {
              error:
                "AI service is currently overloaded. Please try again in a few minutes.",
              details:
                "The AI service is experiencing high demand. We've automatically retried your request multiple times.",
              retryable: true,
              suggestedDelay: 60000,
            },
            { status: 503 }
          );
        }

        // Other types of errors
        return NextResponse.json(
          {
            error: "Failed to generate study content. Please try again later.",
            details:
              "We encountered an issue with the AI service. Please try again in a few minutes.",
            retryable: true,
          },
          { status: 500 }
        );
      }
    }

    if (!aiContent || !aiContent.trim()) {
      return NextResponse.json(
        { error: "Empty response from AI service" },
        { status: 500 }
      );
    }

    // Parse the AI content to ensure it's valid JSON
    let parsedContent;
    try {
      // Try to extract JSON if wrapped in markdown
      const match = aiContent.match(/```json\s*([\s\S]*?)\s*```/i);
      const jsonString = match ? match[1] : aiContent.trim();
      parsedContent = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      return NextResponse.json(
        {
          error: "AI generated invalid content format",
          details:
            "The AI service returned content that couldn't be parsed as valid JSON.",
          rawContent: aiContent.slice(0, 500), // Include first 500 chars for debugging
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      content: parsedContent,
      message: "Study content generated successfully",
      studyType,
    });
  } catch (error: any) {
    console.error("Error in generate-study-ai-content:", error);

    // Handle specific error types
    if (
      error.message?.includes("overloaded") ||
      error.message?.includes("Service Unavailable")
    ) {
      return NextResponse.json(
        {
          error:
            "AI service is currently overloaded. Please try again in a few minutes.",
          details: error.message,
          retryable: true,
          suggestedDelay: 60000,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error?.message || "An unexpected error occurred",
        retryable: false,
      },
      { status: 500 }
    );
  }
}
