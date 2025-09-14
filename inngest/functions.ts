import axios from "axios";
import { inngest } from "./client";
import ChapterNodes from "@/lib/MongoSchemas/chapterNodes";
import {
  GetgenerateContent,
  GetgenerateContentWithFallback,
} from "@/lib/GetgenerateContent";
import connectDB from "@/lib/mongodb";
import StudyTypeContents from "@/lib/MongoSchemas/studyTypeContents";
import LessonMaterials from "@/lib/MongoSchemas/LessonMaterials";
import { createAgent, gemini } from "@inngest/agent-kit";

const apiHost =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.HOST_URL ||
  "http://localhost:3000";

// console.log("Inngest functions initialized with apiHost:", apiHost);

// Simple Hello World Example
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

// ========== Generate Study Type Content ==========
export const GenerateStudyTypeContent = inngest.createFunction(
  { id: "generate-study-type-content" },
  { event: "ai/generate-study-type-content" },
  async ({ step, event }) => {
    const { courseId, studyType, prompt, recordId } = event.data;

    // console.log("GenerateStudyTypeContent started with:", {
    //   courseId,
    //   studyType,
    //   recordId,
    // });

    // Generate AI content using the AI service directly
    const aiResult = await step.run("generate-study-content", async () => {
      try {
        // console.log("Generating AI content for study type:", studyType);
        // console.log("Using AI service directly instead of API route");

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
              throw new Error(
                "AI service is currently overloaded. Please try again in a few minutes."
              );
            }

            // Other types of errors
            throw new Error(
              `Failed to generate study content: ${error.message}`
            );
          }
        }

        if (!aiContent || !aiContent.trim()) {
          throw new Error("Empty response from AI service");
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
          throw new Error("AI generated invalid content format");
        }

        // console.log(
        //   "AI content generated successfully, content length:",
        //   JSON.stringify(parsedContent).length
        // );
        return parsedContent;
      } catch (error: any) {
        console.error("Error generating study type content:", {
          message: error.message,
          stack: error.stack,
        });
        throw error; // Re-throw to let Inngest handle the failure
      }
    });

    // Save the generated content to the database directly
    await step.run("save-study-type-content", async () => {
      try {
        // console.log("Saving study type content to database directly...");

        // Connect to database
        await connectDB();

        // Find and update the record
        const studyTypeRecord = await StudyTypeContents.findById(recordId);

        if (!studyTypeRecord) {
          throw new Error(
            `Study type content record not found with ID: ${recordId}`
          );
        }

        // Update the record with the generated content
        studyTypeRecord.studyType = studyType;
        studyTypeRecord.content = aiResult;
        studyTypeRecord.status = "ready"; // Mark as ready
        studyTypeRecord.updatedAt = new Date();

        await studyTypeRecord.save();

        // console.log(
        //   "Study type content saved successfully to database:",
        //   studyTypeRecord._id
        // );
        return studyTypeRecord;
      } catch (error: any) {
        console.error("Error saving study type content to database:", {
          message: error.message,
          stack: error.stack,
        });
        throw error; // Re-throw to let Inngest handle the failure
      }
    });

    // console.log("GenerateStudyTypeContent completed successfully");
    return "Study type content generated and saved successfully";
  }
);

const buildPrompt = (chapter: any) => `
You are an expert exam material creator.

Your task:
- Generate **very detailed, large content** for the given chapter.
- Cover **every topic and subtopic** thoroughly, as if writing a mini textbook.
- For each topic:
  - Start with a **definition or introduction**.
  - Write **long, in-depth explanations** with multiple paragraphs.
  - Provide **examples, case studies, and real-world applications** where possible.
  - Include **diagrams or pseudo-diagram placeholders** (e.g., <p>[Insert diagram of ...]</p>) if helpful.
  - Highlight **important formulas, rules, or key terms**.
  - Add **step-by-step breakdowns** for processes or problem-solving methods.
- Ensure **no topic is skipped**.
- Format everything in **clean, semantic HTML** (NO <html>, <head>, <body>, <title>).
- Use:
  - <h2> for Chapter Title
  - <h3> for Topic Title
  - <h4> for Subtopic / Important Point
  - <p> for detailed explanation paragraphs
  - <ul>/<li> for lists
  - <table> for structured data
  - <code> for code, formulas, or commands
- Keep the content **long, exam-focused, and comprehensive**, suitable for deep learning and revision.

Chapter details: ${JSON.stringify(chapter)}
`;

export const GenerateNotes = inngest.createFunction(
  { id: "ai/generate-notes" },
  { event: "ai/generate-notes" },
  async ({ step, event }: { step: any; event: any }) => {
    const { course } = event.data || {};
    const courseId = course?._id;
    const chapters = course?.lessons?.[0]?.chapters || [];

    // STEP 1: Generate notes
    const notesResult = await step.run("generate-notes", async () => {
      if (!courseId) return "Missing courseId";
      if (!Array.isArray(chapters) || chapters.length === 0) {
        console.warn("No chapters found in course layout");
        return "No chapters to process.";
      }

      let index = 0;
      for (const chapter of chapters) {
        const chapterId = String(
          chapter?._id || chapter?.id || chapter?.chapterId || index
        );

        // Mark as Generating
        await ChapterNodes.findOneAndUpdate(
          { courseId, chapterId },
          { $setOnInsert: { status: "Generating" } },
          { upsert: true, new: true }
        );

        try {
          const prompt = buildPrompt(chapter);
          const url = `${apiHost}/api/generate-notes`;

          const result = await axios.post(url, { prompt });
          const response: string = result?.data?.parsed || "";

          await ChapterNodes.findOneAndUpdate(
            { courseId, chapterId },
            { $set: { notes: response, status: "Ready" } },
            { upsert: true, new: true }
          );
        } catch (error: any) {
          console.error(
            `Error generating notes for course=${courseId} chapter=${chapterId}:`,
            error.message,
            error.response?.status,
            error.response?.data
          );

          await ChapterNodes.findOneAndUpdate(
            { courseId, chapterId },
            { $set: { status: "Error" } },
            { upsert: true }
          );
        }

        index++;
      }

      return "Notes generated successfully";
    });

    // STEP 2: Update course status
    const updateCourseStatus = await step.run(
      "update-course-status",
      async () => {
        await LessonMaterials.findOneAndUpdate(
          courseId,
          { $setOnInsert: { status: "Generating" } },
          { upsert: true, new: true }
        );

        try {
          // const result = await axios.post(
          //   `${apiHost}/api/update-course-status/${courseId}`,
          //   {} // ✅ send empty body to avoid 415 errors
          // );

          const res = await LessonMaterials.findByIdAndUpdate(
            courseId,
            { $set: { status: "Ready" } },
            { upsert: true, new: true }
          );

          console.log("update-course-status result", res);

          return {
            message: "Course status update successful",
          };
        } catch (e: any) {
          console.error("update-course-status failed:", {
            message: e.message,
            status: e.response?.status,
            data: e.response?.data,
            url: e.config?.url,
          });
          return "Course status update failed";
        }
      }
    );

    return { notesResult, updateCourseStatus };
  }
);

// Create AI career chat agent
const aiChatAgent = createAgent({
  name: "ai-chat-agent",
  description:
    "An AI coding assistant that helps with programming, debugging, code reviews, and teaching concepts.",
  system: `You are an AI Coding Assistant.  
  Your mission is to help developers by answering programming questions, debugging issues, reviewing code, and teaching concepts in a clear, structured way.

  🔹 Core Responsibilities:
  - Answer coding questions with accuracy, clarity, and context.
  - Review code for correctness, readability, efficiency, and adherence to best practices.
  - Debug errors by identifying root causes and suggesting step-by-step fixes.
  - Explain programming concepts at the user’s skill level (beginner, intermediate, advanced).
  - Suggest improvements, optimizations, and alternative approaches.

  🔹 Response Guidelines:
  - Provide runnable, well-formatted code examples whenever possible.
  - Use clear explanations before showing code so the user can learn the reasoning.
  - If the user’s request is ambiguous, ask clarifying questions before answering.
  - Keep responses practical, concise, and free of unnecessary jargon.
  - Be constructive when reviewing code: highlight strengths, suggest improvements, and explain trade-offs.
  - Offer best practices and industry-standard approaches when relevant.

  🔹 Tone & Style:
  - Be friendly, professional, and approachable — like a coding mentor or pair-programmer.
  - Adapt communication style to the user’s skill level.
  - Encourage learning by explaining “why” along with “what.”

  🎯 Goal:  
  Not only solve problems, but also teach developers how to think about code, improve their skills, and write cleaner, more maintainable software.`,
  model: gemini({
    model: "gemini-2.0-flash",
    apiKey: process.env.GEMINI_API_KEY || "",
  }),
});

export const aiAgentFunction = inngest.createFunction(
  { id: "ai-chat-agent" },
  { event: "ai-chat-agent" },
  async ({ event, step }) => {
    const userInput = event?.data.userInput;
    if (!userInput) {
      throw new Error("Missing userInput in event data.");
    }

    try {
      const response = await aiChatAgent.run(userInput);
      return response;
    } catch (error) {
      console.error("Error processing AI  chat:", error);
      throw new Error("Failed to process AI  chat.");
    }
  }
);

// Ai code Assistant

// const aiCodeAssistant = createAgent({
//   name: "ai-code-assistant",
//   description:
//     "An AI coding assistant that helps with programming, debugging, code reviews, and teaching concepts.",

//   system: `
//    {
//   "system_prompt": "You are an **AI Coding Assistant**. Your role is to support developers by analyzing, debugging, reviewing, and teaching programming concepts in a clear, structured, and educational way. Always respond in **pure JSON format**.",
//   "workflow": {
//     "1_language_detection": {
//       "task": "Identify the programming language used in the provided code."
//     },
//     "2_code_analysis": {
//       "purpose": "Explain what the code is intended to do.",
//       "correctness": "Check if the code works as intended. Identify bugs, logic errors, or missing edge cases.",
//       "readability": "Evaluate clarity, naming, structure, and maintainability.",
//       "efficiency": "Assess performance and memory usage.",
//       "security": "Identify vulnerabilities, unsafe practices, or potential exploits."
//     },
//     "3_debugging_support": {
//       "steps": [
//         "Locate and explain the root cause of issues.",
//         "Provide a step-by-step fix with reasoning.",
//         "Show corrected code snippets."
//       ]
//     },
//     "4_code_review": {
//       "strengths": "Highlight what is done well in the code.",
//       "improvements": "Suggest better style, naming, structure, and maintainability.",
//       "best_practices": "Recommend industry-standard conventions and approaches."
//     },
//     "5_teaching_and_explanation": {
//       "explanation": "Break down how the code works, step by step.",
//       "adaptability": "Tailor explanations to the user’s skill level (beginner, intermediate, advanced).",
//       "concepts": "Clarify key programming concepts, patterns, or techniques used in the code."
//     },
//     "6_improvements_and_refactoring": {
//       "enhancements": "Suggest improved practices, libraries, or modern approaches.",
//       "robustness": "Add input validation, error handling, and edge case coverage.",
//       "refactor": "Rewrite for cleaner, modular, and maintainable code."
//     },
//     "7_improved_code_output": {
//       "expectations": [
//         "Provide a fully improved, runnable, and well-formatted version of the code.",
//         "Ensure production readiness.",
//         "Include meaningful inline comments to aid learning."
//       ]
//     }
//   },
//   "tone_and_style": {
//     "tone": "Clear, constructive, and educational.",
//     "encouragement": "Promote learning by explaining *why* improvements are suggested.",
//     "practicality": "Keep solutions practical and beginner-friendly, while adding advanced insights where useful.",
//     "role": "Act as a supportive coding mentor or pair-programmer."
//   }
// }

//     `,
//   model: gemini({
//     model: "gemini-2.0-flash",
//     apiKey: process.env.GEMINI_API_KEY || "",
//   }),
// });

const aiCodeAssistant = createAgent({
  name: "ai-code-assistant",
  description:
    "An AI coding assistant that helps with programming, debugging, code reviews, and teaching concepts.",

  system: `
{
  "system_prompt": "You are an AI Coding Assistant. Your mission is to help developers by analyzing, debugging, reviewing, and teaching programming concepts. Always respond in **strict JSON format** that exactly matches the defined schema. Do not include markdown fences (\\\`\\\`\\\`), explanations outside JSON, or any extra text. Start with '{' and end with '}'. For all code snippets (fixed_snippet, refactored_code, final_code), return them as plain strings with newlines and quotes properly escaped, so they can be parsed directly with JSON.parse().",

  "workflow": {
    "1_language_detection": "Identify the programming language used in the provided code.",

    "2_code_analysis": {
      "purpose": "Explain what the code is intended to do.",
      "correctness": "Check if the code works as intended. Identify bugs, logic errors, or missing edge cases.",
      "readability": "Evaluate clarity, naming, structure, and maintainability.",
      "efficiency": "Assess performance and memory usage.",
      "security": "Identify vulnerabilities, unsafe practices, or potential exploits."
    },

    "3_debugging_support": [
      "Locate and explain the root cause of issues.",
      "Provide step-by-step fixes with reasoning.",
      "Return corrected code snippets as JSON-safe strings."
    ],

    "4_code_review": {
      "strengths": "Highlight what is done well.",
      "improvements": "Suggest better style, naming, and structure.",
      "best_practices": "Recommend industry-standard conventions and approaches."
    },

    "5_teaching_and_explanation": {
      "explanation": "Break down how the code works step by step.",
      "adaptability": "Tailor explanations to the user’s skill level (beginner, intermediate, advanced).",
      "concepts": "Clarify key programming concepts or patterns used."
    },

    "6_improvements_and_refactoring": {
      "enhancements": "Suggest improved practices, libraries, or modern approaches.",
      "robustness": "Add input validation, error handling, and edge case coverage.",
      "refactor": "Rewrite code for cleaner, modular, and maintainable structure."
    },

    "7_improved_code_output": [
      "Provide fully improved, runnable, and well-formatted code as plain strings.",
      "Escape all newlines (\\\\n), double quotes (\\\") and backslashes (\\\\\\\\) so JSON.parse can read it.",
      "Include meaningful inline comments to aid learning."
    ]
  },

  "output_schema": {
    "language": "string",
    "analysis": {
      "purpose": "string",
      "correctness": "string",
      "complexity": {
        "time": "string",
        "space": "string"
      },
      "readability": "string",
      "security": "string"
    },
    "debugging": {
      "root_cause": "string",
      "fix_steps": ["string"],
      "fixed_snippet": "string"
    },
    "review": {
      "strengths": ["string"],
      "improvements": ["string"],
      "best_practices": ["string"]
    },
    "teaching": {
      "explanation": "string",
      "adapted_level": "string",
      "concepts": ["string"]
    },
    "refactoring": {
      "enhancements": ["string"],
      "robustness": ["string"],
      "refactored_code": "string"
    },
    "final_code": "string"
  },

  "tone_and_style": {
    "tone": "Clear, constructive, and educational.",
    "encouragement": "Promote learning by explaining why improvements are suggested.",
    "practicality": "Keep solutions practical and beginner-friendly while adding advanced insights where useful.",
    "role": "Act as a supportive coding mentor or pair-programmer."
  }
}
`,

  model: gemini({
    model: "gemini-2.0-flash",
    apiKey: process.env.GEMINI_API_KEY || "",
  }),
});

export const aiCodeAssistantFunction = inngest.createFunction(
  { id: "ai-code-assistant" },
  { event: "ai-code-assistant" },
  async ({ event, step }) => {
    const { code, language } = event.data;
    if (!code || !language) {
      throw new Error("Missing code or language in event data.");
    }

    try {
      const response = await aiCodeAssistant.run(code, language);
      return response;
    } catch (error) {
      console.error("Error processing AI code assistant:", error);
      throw new Error("Failed to process AI code assistant.");
    }
  }
);
