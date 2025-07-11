import * as Sentry from '@sentry/react';
import { devLog } from '@/utils/production';

// Initialize Sentry for error tracking
export const initializeMonitoring = () => {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      tracesSampleRate: 0.1,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      beforeSend(event) {
        // Filter out non-critical errors in production
        if (event.exception) {
          const error = event.exception.values?.[0];
          if (error?.type === 'ChunkLoadError' || error?.type === 'NetworkError') {
            return null;
          }
        }
        return event;
      },
    });
  }
};

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(label: string): void {
    this.metrics.set(label, performance.now());
  }

  endTimer(label: string): number {
    const startTime = this.metrics.get(label);
    if (!startTime) {
      devLog.warn(`Timer ${label} was not started`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.metrics.delete(label);

    // Send to analytics if duration is significant
    if (duration > 100) {
      this.trackPerformanceMetric(label, duration);
    }

    return duration;
  }

  trackPerformanceMetric(label: string, duration: number): void {
    if (import.meta.env.PROD) {
      // Send to your analytics service
      fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric: label,
          duration,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
        }),
      }).catch(() => {
        // Silently fail for analytics
      });
    } else {
      devLog.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    }
  }

  trackUserAction(action: string, metadata?: Record<string, any>): void {
    if (import.meta.env.PROD) {
      Sentry.addBreadcrumb({
        message: action,
        data: metadata,
        level: 'info',
        category: 'user-action',
      });
    }
    
    devLog.log(`🎯 User Action: ${action}`, metadata);
  }

  trackError(error: Error, context?: Record<string, any>): void {
    if (import.meta.env.PROD) {
      Sentry.captureException(error, {
        extra: context,
      });
    }
    
    devLog.error('🚨 Error tracked:', error, context);
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

// A/B Testing framework
export class ABTestManager {
  private static instance: ABTestManager;
  private activeTests: Map<string, string> = new Map();

  static getInstance(): ABTestManager {
    if (!ABTestManager.instance) {
      ABTestManager.instance = new ABTestManager();
    }
    return ABTestManager.instance;
  }

  getVariant(testName: string, variants: string[] = ['A', 'B']): string {
    if (this.activeTests.has(testName)) {
      return this.activeTests.get(testName)!;
    }

    // Simple hash-based assignment for consistent user experience
    const userId = localStorage.getItem('user_id') || 'anonymous';
    const hash = this.hashCode(testName + userId);
    const variantIndex = Math.abs(hash) % variants.length;
    const variant = variants[variantIndex];

    this.activeTests.set(testName, variant);
    
    // Track assignment
    this.trackTestAssignment(testName, variant);
    
    return variant;
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  private trackTestAssignment(testName: string, variant: string): void {
    performanceMonitor.trackUserAction('ab_test_assignment', {
      test: testName,
      variant,
    });
  }

  trackConversion(testName: string, conversionType: string): void {
    const variant = this.activeTests.get(testName);
    if (variant) {
      performanceMonitor.trackUserAction('ab_test_conversion', {
        test: testName,
        variant,
        conversion: conversionType,
      });
    }
  }
}

export const abTestManager = ABTestManager.getInstance();

// Web Vitals tracking
export const trackWebVitals = () => {
  if (import.meta.env.DEV) {
    import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB }) => {
      onCLS((metric) => performanceMonitor.trackPerformanceMetric('CLS', metric.value));
      onFCP((metric) => performanceMonitor.trackPerformanceMetric('FCP', metric.value));
      onLCP((metric) => performanceMonitor.trackPerformanceMetric('LCP', metric.value));
      onTTFB((metric) => performanceMonitor.trackPerformanceMetric('TTFB', metric.value));
    });
  }
};