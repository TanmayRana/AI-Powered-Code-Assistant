import { useState, useCallback } from "react";
import {
  AIErrorResponse,
  isAIServiceError,
  shouldRetryRequest,
  calculateRetryDelay,
} from "@/lib/utils";

interface UseAIRetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  onError?: (error: AIErrorResponse) => void;
  onRetry?: (attempt: number) => void;
}

interface UseAIRetryReturn {
  execute: <T>(fn: () => Promise<T>) => Promise<T>;
  isRetrying: boolean;
  retryCount: number;
  lastError: AIErrorResponse | null;
  reset: () => void;
}

export function useAIRetry(options: UseAIRetryOptions = {}): UseAIRetryReturn {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    onError,
    onRetry,
  } = options;

  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<AIErrorResponse | null>(null);

  const reset = useCallback(() => {
    setIsRetrying(false);
    setRetryCount(0);
    setLastError(null);
  }, []);

  const execute = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T> => {
      let attempt = 0;

      while (attempt <= maxRetries) {
        try {
          if (attempt > 0) {
            setIsRetrying(true);
            setRetryCount(attempt);
            onRetry?.(attempt);

            const delay = calculateRetryDelay(attempt - 1, baseDelay, maxDelay);
            // console.log(
            //   `Retrying in ${Math.round(
            //     delay
            //   )}ms... (attempt ${attempt}/${maxRetries})`
            // );
            await new Promise((resolve) => setTimeout(resolve, delay));
          }

          const result = await fn();

          // Success - reset state
          reset();
          return result;
        } catch (error: any) {
          attempt++;

          // Check if we should retry
          if (shouldRetryRequest(error, attempt - 1, maxRetries)) {
            continue; // Retry
          }

          // Don't retry or max retries reached
          const errorResponse: AIErrorResponse = {
            error: isAIServiceError(error)
              ? "AI service is currently overloaded. Please try again in a few minutes."
              : "An error occurred while processing your request.",
            details: error.message || error.toString(),
            retryable: isAIServiceError(error),
            suggestedDelay: isAIServiceError(error) ? 60000 : undefined,
          };

          setLastError(errorResponse);
          setIsRetrying(false);
          setRetryCount(attempt - 1);

          onError?.(errorResponse);
          throw errorResponse;
        }
      }

      // This should never be reached due to the while loop logic
      throw new Error(`Failed after ${maxRetries} attempts`);
    },
    [maxRetries, baseDelay, maxDelay, onError, onRetry, reset]
  );

  return {
    execute,
    isRetrying,
    retryCount,
    lastError,
    reset,
  };
}

// Hook for handling specific AI API calls with retry logic
export function useAIGenerateContent() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<AIErrorResponse | null>(null);

  const { execute, isRetrying, retryCount, reset } = useAIRetry({
    onError: setError,
    onRetry: (attempt) => console.log(`Retry attempt ${attempt}`),
  });

  const generateContent = useCallback(
    async (prompt: string, endpoint: string = "/api/generate-notes") => {
      setIsGenerating(true);
      setError(null);

      try {
        const response = await execute(async () => {
          const result = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
          });

          if (!result.ok) {
            const errorData = await result.json();
            throw new Error(errorData.error || `HTTP ${result.status}`);
          }

          return await result.json();
        });

        return response;
      } catch (err: any) {
        setError(err);
        throw err;
      } finally {
        setIsGenerating(false);
      }
    },
    [execute]
  );

  return {
    generateContent,
    isGenerating: isGenerating || isRetrying,
    error,
    retryCount,
    reset,
  };
}
