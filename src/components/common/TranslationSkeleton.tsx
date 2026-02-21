import { Skeleton } from '@/components/ui/skeleton';

/**
 * Glassmorphic skeleton fallback shown while i18n translations load.
 * Used as the Suspense boundary fallback for the entire app.
 */
export function TranslationSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30">
      <div className="relative w-full max-w-md p-8">
        {/* Glassmorphic card */}
        <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-8 shadow-xl space-y-6">
          {/* Logo placeholder */}
          <div className="flex justify-center">
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
          {/* Title */}
          <Skeleton className="h-6 w-3/4 mx-auto rounded-lg" />
          {/* Subtitle */}
          <Skeleton className="h-4 w-1/2 mx-auto rounded-lg" />
          {/* Content blocks */}
          <div className="space-y-3 pt-2">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-2/3 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
