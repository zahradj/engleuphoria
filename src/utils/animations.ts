// Animation utilities with motion preference support

export const getAnimationClass = (animationClass: string) => {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Return reduced motion alternatives
    const reducedMotionMap: Record<string, string> = {
      'animate-fade-in': 'opacity-100',
      'animate-scale-in': 'scale-100',
      'animate-slide-in-right': 'translate-x-0',
      'animate-pulse': '',
      'animate-spin': '',
      'animate-bounce': '',
      'hover:scale-105': 'hover:opacity-90',
      'transition-transform': 'transition-opacity',
      'duration-300': 'duration-150',
      'duration-500': 'duration-200'
    };
    
    return reducedMotionMap[animationClass] || '';
  }
  
  return animationClass;
};

// Safe animation wrapper
export const withReducedMotion = (animations: string[]) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    return animations
      .filter(anim => !anim.includes('animate-') && !anim.includes('transition-transform'))
      .concat(['transition-opacity', 'duration-150']);
  }
  
  return animations;
};

// Animation performance optimization
export const optimizeAnimation = (element: HTMLElement, animationName: string) => {
  // Use will-change for performance
  element.style.willChange = 'transform, opacity';
  
  // Clean up after animation
  const cleanup = () => {
    element.style.willChange = 'auto';
    element.removeEventListener('animationend', cleanup);
    element.removeEventListener('transitionend', cleanup);
  };
  
  element.addEventListener('animationend', cleanup);
  element.addEventListener('transitionend', cleanup);
  
  return cleanup;
};

// Intersection Observer for animation triggers
export const createAnimationObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = { threshold: 0.1 }
) => {
  if (typeof IntersectionObserver === 'undefined') {
    return null;
  }
  
  return new IntersectionObserver(callback, options);
};

// CSS custom properties for dynamic animations
export const setAnimationProperty = (
  element: HTMLElement,
  property: string,
  value: string | number
) => {
  element.style.setProperty(`--${property}`, value.toString());
};