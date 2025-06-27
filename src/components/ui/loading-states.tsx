
import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className={`animate-spin rounded-full border-2 border-blue-500 border-t-transparent ${sizeClasses[size]} mb-3`} />
      {message && (
        <p className="text-sm text-gray-600 text-center">{message}</p>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  showIcon?: boolean;
}

export function ErrorState({ 
  title = "Something went wrong", 
  message, 
  onRetry, 
  retryLabel = "Try again",
  showIcon = true 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {showIcon && (
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

export function ConnectionStatus({ isConnected }: { isConnected: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
      isConnected 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {isConnected ? (
        <>
          <Wifi size={14} />
          <span>Connected</span>
        </>
      ) : (
        <>
          <WifiOff size={14} />
          <span>Disconnected</span>
        </>
      )}
    </div>
  );
}

export function ContentSkeleton() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </Card>
  );
}

export function FileSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
          <Skeleton className="h-10 w-10 rounded" />
          <div className="flex-1">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}
