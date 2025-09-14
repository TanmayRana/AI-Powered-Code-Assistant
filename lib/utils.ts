import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// AI Service Error Handling Utilities
export interface AIErrorResponse {
  error: string;
  details?: string;
  retryable: boolean;
  suggestedDelay?: number;
}

export function isAIServiceError(error: any): boolean {
  if (!error) return false;

  const errorMessage = error.message || error.toString();
  const errorCode = error.code || error.status || error.statusCode;

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

export function createAIErrorResponse(
  error: any,
  defaultMessage: string = "AI service error"
): AIErrorResponse {
  if (isAIServiceError(error)) {
    return {
      error:
        "AI service is currently overloaded. Please try again in a few minutes.",
      details: error.message || error.toString(),
      retryable: true,
      suggestedDelay: 60000, // 1 minute
    };
  }

  return {
    error: defaultMessage,
    details: error.message || error.toString(),
    retryable: false,
  };
}

export function shouldRetryRequest(
  error: any,
  attemptCount: number,
  maxRetries: number = 3
): boolean {
  return attemptCount < maxRetries && isAIServiceError(error);
}

export function calculateRetryDelay(
  attempt: number,
  baseDelay: number = 1000,
  maxDelay: number = 30000
): number {
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  const jitter = Math.random() * 1000; // Add up to 1 second of randomness
  return delay + jitter;
}
