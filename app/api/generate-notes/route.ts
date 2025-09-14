import { NextResponse } from "next/server";
import {
  GetgenerateContent,
  GetgenerateContentWithFallback,
} from "@/lib/GetgenerateContent";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const finalPrompt = `
You are an expert exam material creator.
Your task:
- Generate **detailed study material** for the given chapter.
- Cover **all topics and subtopics thoroughly**, with in-depth explanations.
- For each topic:
  - Provide a clear introduction/definition.
  - Write multiple paragraphs with detailed explanations.
  - Add examples, formulas, steps, and applications where relevant.
  - Highlight key points for exam preparation.
- Ensure **no topic is skipped**.
Formatting rules:
- Output must be in **valid semantic HTML**.
- Do NOT include <html>, <head>, <body>, or <title> tags.
- Use:
  - <h2> → Chapter title
  - <h3> → Topic title
  - <h4> → Subtopic / key idea
  - <p> → Explanations
  - <ul>/<li> → Bullet points
  - <table> → Structured data
  - <code> → Code snippets or formulas
The chapter information is: ${prompt}
`;

    let rawOutput: string;

    try {
      // Try with primary model first
      rawOutput = await GetgenerateContent(finalPrompt);
    } catch (error: any) {
      // console.log("Primary model failed, trying fallback...");

      // If primary fails, try with fallback model
      try {
        rawOutput = await GetgenerateContentWithFallback(finalPrompt);
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
              suggestedDelay: 60000, // Suggest waiting 1 minute
            },
            { status: 503 }
          );
        }

        // Other types of errors
        return NextResponse.json(
          {
            error: "Failed to generate content. Please try again later.",
            details:
              "We encountered an issue with the AI service. Please try again in a few minutes.",
            retryable: true,
          },
          { status: 500 }
        );
      }
    }

    if (!rawOutput || !rawOutput.trim()) {
      return NextResponse.json(
        { error: "Empty response from AI service" },
        { status: 500 }
      );
    }

    // console.log("AI raw output (first 300 chars):", rawOutput.slice(0, 300));

    const cleanedText = rawOutput
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<br\s*[\/]?>/gi, "<br/>")
      .trim();

    return NextResponse.json({
      parsed: cleanedText,
      message: "Notes generated successfully (as HTML).",
    });
  } catch (error: any) {
    console.error("Error in generate-notes:", error);

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
