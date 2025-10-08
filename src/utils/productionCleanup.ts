import { devLog } from './production';

// Remove development-only code from production builds
export const removeConsoleStatements = () => {
  if (import.meta.env.PROD) {
    // Override console methods in production
    const noop = () => {};
    console.log = noop;
    console.debug = noop;
    console.info = noop;
    console.warn = noop;
    // Keep console.error for critical errors
  }
};

// Clean up development artifacts
export const cleanupDevelopmentArtifacts = () => {
  if (import.meta.env.PROD) {
    // Remove any development-only DOM elements
    const devElements = document.querySelectorAll('[data-dev-only]');
    devElements.forEach(element => element.remove());
    
    // Remove development-only CSS classes
    document.body.classList.remove('development');
    
    // Clear development-only localStorage items
    const devKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('dev_') || key.startsWith('debug_')
    );
    devKeys.forEach(key => localStorage.removeItem(key));
  }
};

// Clear all app caches and storage
export const clearAllCaches = async () => {
  try {
    // Clear localStorage (except auth tokens)
    const authKeys = ['supabase.auth.token', 'sb-auth-token'];
    const keysToRemove = Object.keys(localStorage).filter(
      key => !authKeys.some(authKey => key.includes(authKey))
    );
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
    
    console.log('All caches and storage cleared successfully');
  } catch (error) {
    console.error('Error clearing caches:', error);
  }
};

// Production optimization
export const optimizeForProduction = () => {
  if (import.meta.env.PROD) {
    // Remove console statements
    removeConsoleStatements();
    
    // Clean up development artifacts
    cleanupDevelopmentArtifacts();
    
    // Set production flags
    (window as any).__PRODUCTION__ = true;
    (window as any).__DEV__ = false;
    
    devLog.log('Production optimizations applied');
  }
};

// TODO cleanup - replace with real implementations
export const TODO_IMPLEMENTATIONS = {
  // Teacher Dashboard TODOs
  TEACHER_EARNINGS: 'Implement real earnings calculation from Supabase payments table',
  STUDENT_MANAGEMENT: 'Implement student filtering and management with real data',
  PERFORMANCE_METRICS: 'Connect to real teacher performance metrics',
  
  // Student Dashboard TODOs
  HOMEWORK_TRACKING: 'Implement homework submission and tracking system',
  PROGRESS_ANALYTICS: 'Connect to real learning analytics data',
  BOOKING_SYSTEM: 'Complete lesson booking workflow with payment',
  
  // Classroom TODOs
  VIDEO_STREAMING: 'Replace mock video with real WebRTC implementation',
  WHITEBOARD: 'Implement collaborative whiteboard functionality',
  FILE_SHARING: 'Complete file upload and sharing system',
  
  // Admin TODOs
  USER_MANAGEMENT: 'Implement bulk user operations',
  REPORTING: 'Create comprehensive reporting dashboard',
  SYSTEM_MONITORING: 'Add real-time system health monitoring',
};

// Mock data that needs to be replaced
export const MOCK_DATA_TO_REPLACE = [
  'src/data/mockTeachers.ts',
  'src/data/mockStudents.ts', 
  'src/data/mockLessons.ts',
  'src/data/mockPayments.ts',
  'src/data/mockAnalytics.ts',
];

// Log remaining TODOs in development
export const logRemainingTodos = () => {
  if (import.meta.env.DEV) {
    devLog.warn('🚧 Remaining TODOs to implement:');
    Object.entries(TODO_IMPLEMENTATIONS).forEach(([key, description]) => {
      devLog.warn(`- ${key}: ${description}`);
    });
    
    devLog.warn('📄 Mock data files to replace:');
    MOCK_DATA_TO_REPLACE.forEach(file => {
      devLog.warn(`- ${file}`);
    });
  }
};
