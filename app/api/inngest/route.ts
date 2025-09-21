import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import {
  aiAgentFunction,
  aiCodeAssistantFunction,
  aiLessonAgentFunction,
  GenerateNotes,
  GenerateStudyTypeContent,
  helloWorld,
} from "@/inngest/functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld,
    GenerateNotes,
    GenerateStudyTypeContent,
    aiAgentFunction,
    aiCodeAssistantFunction,
    aiLessonAgentFunction,
  ],
});
