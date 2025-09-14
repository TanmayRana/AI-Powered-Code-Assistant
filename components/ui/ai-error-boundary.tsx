"use client";

import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ReloadIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { AIErrorResponse, isAIServiceError } from '@/lib/utils';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class AIErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const error = this.state.error;
      const isAIError = error && isAIServiceError(error);
      
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4">
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>
              {isAIError ? "AI Service Temporarily Unavailable" : "Something went wrong"}
            </AlertTitle>
            <AlertDescription className="mt-2">
              {isAIError ? (
                <div className="space-y-3">
                  <p>
                    The AI service is currently experiencing high demand. This is a temporary issue that should resolve shortly.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Error details: {error?.message}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      onClick={this.handleRetry} 
                      variant="outline" 
                      size="sm"
                    >
                      <ReloadIcon className="mr-2 h-4 w-4" />
                      Try Again
                    </Button>
                    <Button 
                      onClick={() => window.location.reload()} 
                      variant="default" 
                      size="sm"
                    >
                      Refresh Page
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p>
                    An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Error details: {error?.message}
                  </p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="default" 
                    size="sm"
                  >
                    Refresh Page
                  </Button>
                </div>
              )}
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary for functional components
export function useAIErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);
  const [isAIError, setIsAIError] = React.useState(false);

  const handleError = React.useCallback((error: Error) => {
    setError(error);
    setIsAIError(isAIServiceError(error));
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
    setIsAIError(false);
  }, []);

  const retry = React.useCallback(() => {
    clearError();
  }, [clearError]);

  return {
    error,
    isAIError,
    handleError,
    clearError,
    retry
  };
}

// Component for displaying AI service errors with retry functionality
export function AIServiceError({ 
  error, 
  onRetry, 
  onDismiss 
}: { 
  error: AIErrorResponse; 
  onRetry?: () => void; 
  onDismiss?: () => void; 
}) {
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>AI Service Temporarily Unavailable</AlertTitle>
      <AlertDescription className="mt-2">
        <div className="space-y-3">
          <p>{error.error}</p>
          {error.details && (
            <p className="text-sm text-muted-foreground">
              {error.details}
            </p>
          )}
          {error.retryable && (
            <div className="flex gap-2">
              {onRetry && (
                <Button onClick={onRetry} variant="outline" size="sm">
                  <ReloadIcon className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              )}
              {onDismiss && (
                <Button onClick={onDismiss} variant="ghost" size="sm">
                  Dismiss
                </Button>
              )}
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
