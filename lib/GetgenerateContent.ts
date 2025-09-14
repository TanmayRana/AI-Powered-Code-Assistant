"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = ai.getGenerativeModel({
  model: "gemini-2.0-flash",
});

// Retry configuration
const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1 second
const MAX_DELAY = 30000; // 30 seconds

// Exponential backoff with jitter
function calculateDelay(attempt: number): number {
  const delay = Math.min(BASE_DELAY * Math.pow(2, attempt), MAX_DELAY);
  const jitter = Math.random() * 1000; // Add up to 1 second of randomness
  return delay + jitter;
}

// Check if error is retryable
function isRetryableError(error: any): boolean {
  if (!error) return false;

  const errorMessage = error.message || error.toString();
  const errorCode = error.code || error.status || error.statusCode;

  // Retry on service overload, rate limits, and temporary failures
  return (
    errorMessage.includes("overloaded") ||
    errorMessage.includes("Service Unavailable") ||
    errorMessage.includes("rate limit") ||
    errorMessage.includes("quota exceeded") ||
    errorCode === 503 ||
    errorCode === 429 ||
    errorCode === 500 ||
    errorCode === 502
  );
}

export async function GetgenerateContent(
  prompt: string,
  retryCount = 0
): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error: any) {
    console.error(`Attempt ${retryCount + 1} failed:`, error.message || error);

    // Check if we should retry
    if (retryCount < MAX_RETRIES && isRetryableError(error)) {
      const delay = calculateDelay(retryCount);
      // console.log(
      //   `Retrying in ${Math.round(delay)}ms... (attempt ${
      //     retryCount + 1
      //   }/${MAX_RETRIES})`
      // );

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Retry with incremented count
      return GetgenerateContent(prompt, retryCount + 1);
    }

    // If we've exhausted retries or it's not a retryable error, throw
    if (retryCount >= MAX_RETRIES) {
      throw new Error(
        `Failed after ${MAX_RETRIES} attempts. Last error: ${
          error.message || error
        }`
      );
    }

    throw error;
  }
}

// Alternative function with fallback model
export async function GetgenerateContentWithFallback(
  prompt: string
): Promise<string> {
  try {
    return await GetgenerateContent(prompt);
  } catch (error: any) {
    // console.log("Primary model failed, trying fallback model...");

    try {
      // Try with a different model as fallback
      const fallbackModel = ai.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const result = await fallbackModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (fallbackError: any) {
      console.error(
        "Fallback model also failed:",
        fallbackError.message || fallbackError
      );
      throw new Error(
        `Both primary and fallback models failed. Primary: ${error.message}, Fallback: ${fallbackError.message}`
      );
    }
  }
}
