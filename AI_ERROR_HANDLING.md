# AI Service Error Handling & Retry System

This document describes the comprehensive error handling and retry system implemented to handle Google Generative AI (Gemini) service overloads and other temporary failures.

## Overview

The system automatically handles common AI service errors like:
- Service overload (503 Service Unavailable)
- Rate limiting (429)
- Temporary server errors (500, 502)
- Quota exceeded errors

## Features

### 1. Automatic Retry with Exponential Backoff
- **Max Retries**: 3 attempts
- **Base Delay**: 1 second
- **Max Delay**: 30 seconds
- **Jitter**: Random delay variation to prevent thundering herd

### 2. Fallback Model Support
- Primary: `gemini-2.0-flash`
- Fallback: `gemini-1.5-flash`

### 3. User-Friendly Error Messages
- Clear explanations of what went wrong
- Suggested wait times
- Retry buttons where appropriate

## Backend Implementation

### Updated Functions

#### `lib/GetgenerateContent.ts`
```typescript
// Main function with retry logic
export async function GetgenerateContent(prompt: string, retryCount = 0): Promise<string>

// Fallback function using alternative model
export async function GetgenerateContentWithFallback(prompt: string): Promise<string>
```

#### `lib/utils.ts`
```typescript
// Error detection utilities
export function isAIServiceError(error: any): boolean
export function createAIErrorResponse(error: any, defaultMessage?: string): AIErrorResponse
export function shouldRetryRequest(error: any, attemptCount: number, maxRetries?: number): boolean
export function calculateRetryDelay(attempt: number, baseDelay?: number, maxDelay?: number): number
```

### Updated API Routes

#### `/api/generate-notes`
- Automatic retry with fallback model
- Proper HTTP status codes (503 for service overload)
- Detailed error responses with retry suggestions

#### `/api/generate-lesson-outline`
- Same retry and fallback logic
- Consistent error handling

## Frontend Implementation

### React Hooks

#### `hooks/use-ai-retry.ts`
```typescript
// General retry hook
export function useAIRetry(options?: UseAIRetryOptions): UseAIRetryReturn

// Specific hook for AI content generation
export function useAIGenerateContent()
```

### Error Boundary Components

#### `components/ui/ai-error-boundary.tsx`
```typescript
// Class-based error boundary
export class AIErrorBoundary extends Component<Props, State>

// Hook-based error handler
export function useAIErrorHandler()

// Error display component
export function AIServiceError({ error, onRetry, onDismiss })
```

## Usage Examples

### Basic API Call with Retry
```typescript
import { GetgenerateContent } from '@/lib/GetgenerateContent';

try {
  const content = await GetgenerateContent(prompt);
  // Handle success
} catch (error) {
  // Error automatically retried, fallback attempted
  console.error('Failed after all retries:', error);
}
```

### Frontend Component with Error Handling
```typescript
import { useAIGenerateContent } from '@/hooks/use-ai-retry';
import { AIServiceError } from '@/components/ui/ai-error-boundary';

function MyComponent() {
  const { generateContent, isGenerating, error, retryCount } = useAIGenerateContent();

  const handleGenerate = async () => {
    try {
      const result = await generateContent(prompt);
      // Handle success
    } catch (err) {
      // Error handled automatically
    }
  };

  if (error) {
    return (
      <AIServiceError 
        error={error} 
        onRetry={handleGenerate}
        onDismiss={() => setError(null)}
      />
    );
  }

  return (
    <button 
      onClick={handleGenerate} 
      disabled={isGenerating}
    >
      {isGenerating ? `Generating... (${retryCount > 0 ? `Retry ${retryCount}` : ''})` : 'Generate'}
    </button>
  );
}
```

### Error Boundary Wrapper
```typescript
import { AIErrorBoundary } from '@/components/ui/ai-error-boundary';

function App() {
  return (
    <AIErrorBoundary>
      <YourAppContent />
    </AIErrorBoundary>
  );
}
```

## Error Response Format

```typescript
interface AIErrorResponse {
  error: string;           // User-friendly error message
  details?: string;        // Technical error details
  retryable: boolean;      // Whether retry is recommended
  suggestedDelay?: number; // Suggested wait time in milliseconds
}
```

## Configuration

### Environment Variables
```bash
GEMINI_API_KEY=your_api_key_here
```

### Retry Settings
```typescript
const MAX_RETRIES = 3;
const BASE_DELAY = 1000;    // 1 second
const MAX_DELAY = 30000;    // 30 seconds
```

## Monitoring and Logging

The system provides comprehensive logging:
- Retry attempts with delays
- Error details for debugging
- Success/failure tracking
- Performance metrics

## Best Practices

1. **Always wrap AI calls** in try-catch blocks
2. **Use the provided hooks** for consistent error handling
3. **Implement error boundaries** at appropriate levels
4. **Provide user feedback** during retry attempts
5. **Log errors** for monitoring and debugging

## Troubleshooting

### Common Issues

1. **Service Overload (503)**
   - Wait 1-2 minutes before retrying
   - Check Gemini service status
   - Consider reducing request frequency

2. **Rate Limiting (429)**
   - Implement request throttling
   - Use exponential backoff
   - Consider upgrading API quota

3. **Authentication Errors**
   - Verify API key is valid
   - Check API key permissions
   - Ensure proper environment setup

### Debug Mode
Enable detailed logging by setting:
```typescript
console.log(`Retrying in ${delay}ms... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
```

## Future Enhancements

- Circuit breaker pattern for service protection
- Adaptive retry strategies based on error patterns
- Metrics collection and alerting
- A/B testing for different retry strategies
- Integration with monitoring services
