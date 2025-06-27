
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ErrorInfo {
  componentStack?: string;
  errorBoundary?: string;
}

export function useErrorBoundary() {
  const { toast } = useToast();

  const handleError = useCallback((error: Error, errorInfo?: ErrorInfo) => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error);
      console.error('Component stack:', errorInfo?.componentStack);
    }

    // In production, you would send this to an error reporting service
    // like Sentry, LogRocket, etc.
    
    // Show user-friendly error message
    toast({
      title: "An error occurred",
      description: "Something went wrong. Please try refreshing the page.",
      variant: "destructive",
    });
  }, [toast]);

  const handleAsyncError = useCallback((error: Error, context?: string) => {
    console.error(`Async error ${context ? `in ${context}` : ''}:`, error);
    
    toast({
      title: "Operation failed",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
  }, [toast]);

  return {
    handleError,
    handleAsyncError
  };
}
