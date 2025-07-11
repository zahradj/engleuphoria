// Production utilities to replace development-only code

export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Safe console logging that only works in development
export const devLog = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  }
};

// Performance measurement that only runs in development
export const measurePerformance = (name: string, fn: () => void) => {
  if (isDevelopment) {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
  } else {
    fn();
  }
};

// Debug mode checker
export const isDebugMode = () => {
  return isDevelopment && (window as any).__DEBUG_MODE__;
};

// Clean up development-only features for production
export const stripDevFeatures = (obj: any) => {
  if (isProduction && obj) {
    // Remove any __DEV__ properties
    Object.keys(obj).forEach(key => {
      if (key.startsWith('__DEV__') || key.includes('debug')) {
        delete obj[key];
      }
    });
  }
  return obj;
};