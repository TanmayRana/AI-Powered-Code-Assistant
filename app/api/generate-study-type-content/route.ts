import { inngest } from "@/inngest/client";
import StudyTypeContents from "@/lib/MongoSchemas/studyTypeContents";

export async function POST(request: Request) {
  try {
    const { lessonId, studyType, chapters } = await request.json();

    // console.log("generate-study-type-content:", lessonId, studyType, chapters);

    if (!lessonId || !studyType || !chapters) {
      return Response.json(
        { error: "lessonId, studyType, and chapters are required" },
        { status: 400 }
      );
    }

    let finalPrompt: string;

    if (studyType === "flashcard") {
      finalPrompt = `Generate a maximum of 15 flashcards in JSON format about ${chapters}. Include a variety of question types, such as:

            * Definition questions (e.g., "What is a...")
            * Comparison questions (e.g., "What is the difference between...")
            * Code snippet completion (e.g., "Complete the following navigation code: \`Navigator.______(context, ...)\`")
            * Purpose-based questions (e.g., "What is the purpose of the \`Expanded\` widget?")

            Each flashcard should be in JSON format with "front" and "back" keys.`;
    } else if (studyType === "quiz") {
      finalPrompt = `Generate a maximum of 10 multiple-choice quiz questions in JSON format about ${chapters}

        Each question object in the JSON array should have the following keys:

        * "index": A number representing the question number.
        * "question": The full text of the quiz question.
        * "options": An array of objects, where each object has the following keys:
            * "id": A string to identify the option (e.g., "A", "B", "C", "D").
            * "text": The text of the option.
        * "correctAnswerId": A string representing the "id" of the correct option from the "options" array.

        Ensure a variety of question types covering definitions, concepts, code snippets, and best practices within the specified topics.`;
    } else {
      return Response.json(
        { error: "Invalid study type. Must be 'flashcard' or 'quiz'" },
        { status: 400 }
      );
    }

    // Create the initial record
    const result = await StudyTypeContents.create({
      lessonId,
      studyType,
      status: "pending", // Add status to track progress
    });

    // Trigger the Inngest function to handle AI generation
    await inngest.send({
      name: "ai/generate-study-type-content",
      data: {
        courseId: lessonId,
        studyType,
        prompt: finalPrompt,
        recordId: result._id, // Pass the record ID for updating
      },
    });

    return Response.json({
      message: "Study type content generation initiated successfully",
      recordId: result._id,
    });
  } catch (error: any) {
    console.error("Error in generate-study-type-content:", error);
    return Response.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
