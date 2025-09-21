// // pages/api/generate-course.ts

// import { inngest } from "@/inngest/client";
// import { system_prompt } from "@/lib/Constants";
// import {
//   GetgenerateContent,
//   GetgenerateContentWithFallback,
// } from "@/lib/GetgenerateContent";
// import connectDB from "@/lib/mongodb";
// import LessonMaterials from "@/lib/MongoSchemas/LessonMaterials";
// import { currentUser } from "@clerk/nextjs/server";

// export async function POST(request: Request) {
//   await connectDB();
//   try {
//     const body = await request.json();
//     const { topic, difficulty, purpose } = body;

//     console.log(topic, difficulty, purpose);

//     const user = await currentUser();
//     const userEmail = user?.emailAddresses[0].emailAddress;

//     if (!topic) {
//       return new Response(JSON.stringify({ error: "Topic is required" }), {
//         status: 400,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     // Replace placeholders dynamically
//     const final_prompt = system_prompt
//       .replace(/\[Topic Name\]/g, topic)
//       .replace(/\[topic\]/g, topic)
//       .replace(/\[difficulty_level\]/g, difficulty)
//       .replace(/\[study_type\]/g, purpose);

//     console.log(final_prompt);

//     let response: string;

//     try {
//       // Try with primary model first
//       response = await GetgenerateContent(final_prompt);
//     } catch (error: any) {
//       console.log("Primary model failed, trying fallback...");

//       // If primary fails, try with fallback model
//       try {
//         response = await GetgenerateContentWithFallback(final_prompt);
//       } catch (fallbackError: any) {
//         // Both models failed
//         console.error("Both primary and fallback models failed:", {
//           primary: error.message,
//           fallback: fallbackError.message,
//         });

//         // Check if it's a service overload error
//         if (
//           error.message?.includes("overloaded") ||
//           error.message?.includes("Service Unavailable")
//         ) {
//           return new Response(
//             JSON.stringify({
//               error:
//                 "AI service is currently overloaded. Please try again in a few minutes.",
//               details:
//                 "The AI service is experiencing high demand. We've automatically retried your request multiple times.",
//               retryable: true,
//               suggestedDelay: 60000,
//             }),
//             {
//               status: 503,
//               headers: { "Content-Type": "application/json" },
//             }
//           );
//         }

//         // Other types of errors
//         return new Response(
//           JSON.stringify({
//             error: "Failed to generate lesson outline. Please try again later.",
//             details:
//               "We encountered an issue with the AI service. Please try again in a few minutes.",
//             retryable: true,
//           }),
//           {
//             status: 500,
//             headers: { "Content-Type": "application/json" },
//           }
//         );
//       }
//     }

//     if (!response || !response.trim()) {
//       return new Response(
//         JSON.stringify({ error: "Empty response from AI service" }),
//         {
//           status: 500,
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//     }

//     let roadmap;
//     try {
//       const match = response.match(/```json\s*([\s\S]*?)\s*```/i);
//       const jsonString = match ? match[1] : response.trim();
//       roadmap = JSON.parse(jsonString);
//     } catch (err) {
//       console.error("Failed to parse AI response:", err);
//       roadmap = { error: "Invalid AI JSON output" };
//     }

//     // save the output to the database
//     const createlesson = await LessonMaterials.create({
//       purpose,
//       topic,
//       difficulty,
//       lessons: roadmap,
//       userEmail: userEmail,
//       aiAgentType: "ai-lesson-agent",
//     });

//     // console.log("createlesson", createlesson);

//     await inngest.send({
//       name: "ai/generate-notes",
//       data: {
//         course: createlesson,
//       },
//     });

//     return new Response(JSON.stringify(createlesson._id), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (err: any) {
//     console.error(err);

//     // Handle specific error types
//     if (
//       err.message?.includes("overloaded") ||
//       err.message?.includes("Service Unavailable")
//     ) {
//       return new Response(
//         JSON.stringify({
//           error:
//             "AI service is currently overloaded. Please try again in a few minutes.",
//           details: err.message,
//           retryable: true,
//           suggestedDelay: 60000,
//         }),
//         {
//           status: 503,
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//     }

//     return new Response(
//       JSON.stringify({
//         error: err.message || "Internal Server Error",
//         retryable: false,
//       }),
//       {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   }
// }

// pages/api/generate-course.ts
// --------------------------------------
// TODO: Add Inngest event
// import { inngest } from "@/inngest/client";
// import { system_prompt } from "@/lib/Constants";
// import {
//   GetgenerateContent,
//   GetgenerateContentWithFallback,
// } from "@/lib/GetgenerateContent";
// import connectDB from "@/lib/mongodb";
// import LessonMaterials from "@/lib/MongoSchemas/LessonMaterials";
// import { currentUser } from "@clerk/nextjs/server";

// export async function POST(request: Request) {
//   await connectDB();

//   try {
//     const body = await request.json();
//     const { topic, difficulty, purpose } = body;

//     if (!topic) {
//       return new Response(JSON.stringify({ error: "Topic is required" }), {
//         status: 400,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     const user = await currentUser();
//     const userEmail = user?.emailAddresses?.[0]?.emailAddress || "anonymous";

//     // Replace placeholders dynamically in the system prompt
//     const final_prompt = system_prompt
//       .replace(/\[Topic Name\]/g, topic)
//       .replace(/\[topic\]/g, topic)
//       .replace(/\[difficulty_level\]/g, difficulty || "Medium")
//       .replace(/\[study_type\]/g, purpose || "Comprehensive");

//     let response: string;

//     try {
//       // Primary AI call
//       response = await GetgenerateContent(final_prompt);
//     } catch (error: any) {
//       console.error("Primary model failed, trying fallback...", error.message);

//       try {
//         response = await GetgenerateContentWithFallback(final_prompt);
//       } catch (fallbackError: any) {
//         console.error("Both primary and fallback models failed:", {
//           primary: error.message,
//           fallback: fallbackError.message,
//         });

//         // If it's an overload error
//         if (
//           error.message?.includes("overloaded") ||
//           error.message?.includes("Service Unavailable")
//         ) {
//           return new Response(
//             JSON.stringify({
//               error:
//                 "AI service is currently overloaded. Please try again in a few minutes.",
//               retryable: true,
//               suggestedDelay: 60000,
//             }),
//             {
//               status: 503,
//               headers: { "Content-Type": "application/json" },
//             }
//           );
//         }

//         // Other failure
//         return new Response(
//           JSON.stringify({
//             error: "Failed to generate course outline. Please try again later.",
//             retryable: true,
//           }),
//           {
//             status: 500,
//             headers: { "Content-Type": "application/json" },
//           }
//         );
//       }
//     }

//     if (!response || !response.trim()) {
//       return new Response(
//         JSON.stringify({ error: "Empty response from AI service" }),
//         {
//           status: 500,
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//     }

//     // Parse AI JSON output safely
//     let roadmap;
//     try {
//       const match = response.match(/```json\s*([\s\S]*?)\s*```/i);
//       const jsonString = match ? match[1] : response.trim();
//       roadmap = JSON.parse(jsonString);
//     } catch (err) {
//       console.error("Failed to parse AI response:", err);
//       roadmap = { error: "Invalid AI JSON output" };
//     }

//     // Save to DB
//     const createlesson = await LessonMaterials.create({
//       purpose,
//       topic,
//       difficulty,
//       lessons: roadmap,
//       userEmail,
//       aiAgentType: "ai-lesson-agent",
//     });

//     // Fire Inngest event
//     await inngest.send({
//       name: "ai/generate-notes",
//       data: { course: createlesson },
//     });

//     return new Response(JSON.stringify({ id: createlesson._id }), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (err: any) {
//     console.error("Unhandled error:", err);

//     if (
//       err.message?.includes("overloaded") ||
//       err.message?.includes("Service Unavailable")
//     ) {
//       return new Response(
//         JSON.stringify({
//           error: "AI service is currently overloaded. Please try again later.",
//           retryable: true,
//           suggestedDelay: 60000,
//         }),
//         {
//           status: 503,
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//     }

//     return new Response(
//       JSON.stringify({
//         error: err.message || "Internal Server Error",
//         retryable: false,
//       }),
//       {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   }
// }

// ------------------------------------

// import { inngest } from "@/inngest/client";
// import { system_prompt } from "@/lib/Constants";
// import {
//   GetgenerateContent,
//   GetgenerateContentWithFallback,
// } from "@/lib/GetgenerateContent";
// import connectDB from "@/lib/mongodb";
// import LessonMaterials from "@/lib/MongoSchemas/LessonMaterials";
// import { currentUser } from "@clerk/nextjs/server";

// export async function POST(request: Request) {
//   await connectDB();

//   try {
//     const body = await request.json();
//     const { topic, difficulty, purpose } = body;

//     if (!topic) {
//       return new Response(JSON.stringify({ error: "Topic is required" }), {
//         status: 400,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     const user = await currentUser();
//     const userEmail = user?.emailAddresses?.[0]?.emailAddress || "anonymous";

//     // Replace placeholders dynamically in the system prompt
//     const final_prompt = system_prompt
//       .replace(/\[Topic Name\]/g, topic)
//       .replace(/\[topic\]/g, topic)
//       .replace(/\[difficulty_level\]/g, difficulty || "Medium")
//       .replace(/\[study_type\]/g, purpose || "Comprehensive");

//     let response: string;

//     try {
//       // Primary AI call
//       response = await GetgenerateContent(final_prompt);
//     } catch (error: any) {
//       console.error("Primary model failed, trying fallback...", error.message);

//       try {
//         response = await GetgenerateContentWithFallback(final_prompt);
//       } catch (fallbackError: any) {
//         console.error("Both primary and fallback models failed:", {
//           primary: error.message,
//           fallback: fallbackError.message,
//         });

//         // If it's an overload error
//         if (
//           error.message?.includes("overloaded") ||
//           error.message?.includes("Service Unavailable")
//         ) {
//           return new Response(
//             JSON.stringify({
//               error:
//                 "AI service is currently overloaded. Please try again in a few minutes.",
//               retryable: true,
//               suggestedDelay: 60000,
//             }),
//             {
//               status: 503,
//               headers: { "Content-Type": "application/json" },
//             }
//           );
//         }

//         // Other failure
//         return new Response(
//           JSON.stringify({
//             error: "Failed to generate course outline. Please try again later.",
//             retryable: true,
//           }),
//           {
//             status: 500,
//             headers: { "Content-Type": "application/json" },
//           }
//         );
//       }
//     }

//     if (!response || !response.trim()) {
//       return new Response(
//         JSON.stringify({ error: "Empty response from AI service" }),
//         {
//           status: 500,
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//     }

//     // Parse AI JSON output safely
//     let roadmap;
//     try {
//       const match = response.match(/```json\s*([\s\S]*?)\s*```/i);
//       const jsonString = match ? match[1] : response.trim();
//       roadmap = JSON.parse(jsonString);
//     } catch (err) {
//       console.error("Failed to parse AI response:", err);
//       roadmap = { error: "Invalid AI JSON output" };
//     }

//     // Save to DB
//     const createlesson = await LessonMaterials.create({
//       purpose,
//       topic,
//       difficulty,
//       lessons: roadmap,
//       userEmail,
//       aiAgentType: "ai-lesson-agent",
//     });

//     // Fire Inngest event
//     await inngest.send({
//       name: "ai/generate-notes",
//       data: { course: createlesson },
//     });

//     return new Response(JSON.stringify({ id: createlesson._id }), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (err: any) {
//     console.error("Unhandled error:", err);

//     if (
//       err.message?.includes("overloaded") ||
//       err.message?.includes("Service Unavailable")
//     ) {
//       return new Response(
//         JSON.stringify({
//           error: "AI service is currently overloaded. Please try again later.",
//           retryable: true,
//           suggestedDelay: 60000,
//         }),
//         {
//           status: 503,
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//     }

//     return new Response(
//       JSON.stringify({
//         error: err.message || "Internal Server Error",
//         retryable: false,
//       }),
//       {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   }
// }

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
    const { topic, difficulty, purpose } = body;

    if (!topic) {
      return new Response(JSON.stringify({ error: "Topic is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await currentUser();
    const userEmail = user?.emailAddresses?.[0]?.emailAddress || "anonymous";

    // Replace placeholders dynamically in the system prompt
    const final_prompt = `Generate a study material for ${topic} for ${purpose} with a difficulty level of ${difficulty}. The output should be a JSON object with the following structure and include **at least ten chapters**, each with an equivalent emoji:

    {
      "courseTitle": "Title of the course",
      "category": "Domain (e.g., 'Computer Science', 'Artificial Intelligence', 'Web Development'...)",
     "difficulty": "Easy | Medium | Hard",
    "duration": "Total course duration (e.g., '10-15 hours','2-3 hours')",
    "courseSummary": "What learners will gain. 🚀",
    "thumbnail": "Relevant emoji (e.g., '🐍', '🕸️', '🧩', '⚙️', '🤖', '📊', '🗄️', '🔐',Others → infer logically.)",
    "lessons": 25,
    "language": "(e.g 'Python', 'Java', 'C++',...)",
      "chapters": [
        {
          "chapterNumber": 1,
          "chapterTitle": "Introduction to the Topic",
          "chapterSummary": "A brief overview of the fundamental concepts. 💡",
          "emoji": "📚",
          "topics": [
            "Basic concept 1",
            "Basic concept 2"
          ],
        "estimatedLessonCount": 2,
        "estimatedChapterDuration": "1-2 hours"

        },
        ...
      {
        "chapterNumber": 10,
        "chapterTitle": "Wrap-Up: Projects, Review, and Next Steps",
        "chapterSummary": "Final summary, practice ideas, and future directions. 🌟",
        "emoji": "🌟",
        "topics": [
          "Basic concept 1",
          "Basic concept 2"
        ],
        "estimatedLessonCount": 2,
        "estimatedChapterDuration": "1.5-2 hours"
      }
      ]
    }

    Please ensure the entire response is a valid JSON string adhering to the structure above, contains at least ten distinct chapters, and each chapter object includes an "emoji" field with a relevant emoji. Feel free to choose emojis that you believe best represent the chapter's theme. I've provided some examples, but you can use your own judgment. The course summary should also have a relevant emoji.
    `;

    let response: string;

    try {
      // Primary AI call
      response = await GetgenerateContent(final_prompt);
    } catch (error: any) {
      console.error("Primary model failed, trying fallback...", error.message);

      try {
        response = await GetgenerateContentWithFallback(final_prompt);
      } catch (fallbackError: any) {
        console.error("Both primary and fallback models failed:", {
          primary: error.message,
          fallback: fallbackError.message,
        });

        // If it's an overload error
        if (
          error.message?.includes("overloaded") ||
          error.message?.includes("Service Unavailable")
        ) {
          return new Response(
            JSON.stringify({
              error:
                "AI service is currently overloaded. Please try again in a few minutes.",
              retryable: true,
              suggestedDelay: 60000,
            }),
            {
              status: 503,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        // Other failure
        return new Response(
          JSON.stringify({
            error: "Failed to generate course outline. Please try again later.",
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

    // Parse AI JSON output safely
    let roadmap;
    try {
      const match = response.match(/```json\s*([\s\S]*?)\s*```/i);
      const jsonString = match ? match[1] : response.trim();
      roadmap = JSON.parse(jsonString);
    } catch (err) {
      console.error("Failed to parse AI response:", err);
      roadmap = { error: "Invalid AI JSON output" };
    }

    // Save to DB
    const createlesson = await LessonMaterials.create({
      purpose,
      topic,
      difficulty,
      lessons: roadmap,
      userEmail,
      aiAgentType: "ai-lesson-agent",
    });

    // Fire Inngest event
    await inngest.send({
      name: "ai/generate-notes",
      data: { course: createlesson },
    });

    return new Response(JSON.stringify({ id: createlesson._id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Unhandled error:", err);

    if (
      err.message?.includes("overloaded") ||
      err.message?.includes("Service Unavailable")
    ) {
      return new Response(
        JSON.stringify({
          error: "AI service is currently overloaded. Please try again later.",
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
