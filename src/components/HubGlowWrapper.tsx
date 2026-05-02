import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type HubType = 'Playground' | 'Academy' | 'Professional';

interface HubGlowWrapperProps {
  hubType?: HubType;
  className?: string;
  children: ReactNode;
  /** Glow radius in px. Default 600. */
  radius?: number;
}

const HUB_GLOW_COLOR: Record<HubType, string> = {
  // Sunshine yellow (Playground = Yellow/Orange brand)
  Playground: 'rgba(250, 204, 21, 0.18)',
  // Light neon violet (Academy = Blue/Purple brand)
  Academy: 'rgba(167, 139, 250, 0.18)',
  // Sleek neon cyan/sky (Professional / Success Hub)
  Professional: 'rgba(56, 189, 248, 0.18)',
};

/**
 * Reusable mouse-tracking radial glow wrapper.
 * - Listens on `window` so the glow follows the cursor anywhere on screen,
 *   even when content above intercepts pointer events.
 * - Glow layer is `fixed inset-0 z-0 pointer-events-none` so it covers the
 *   whole viewport behind the content and never steals clicks.
 */
const HubGlowWrapper = ({
  hubType = 'Academy',
  className,
  children,
  radius = 600,
}: HubGlowWrapperProps) => {
  const glowRef = useRef<HTMLDivElement>(null);
  const color = HUB_GLOW_COLOR[hubType];

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    // Center the glow on mount (handles touch devices that never fire mousemove).
    el.style.setProperty('--mouse-x', '50%');
    el.style.setProperty('--mouse-y', '50%');

    let frame = 0;
    let nextX = 0;
    let nextY = 0;

    const handleMove = (e: MouseEvent) => {
      // Use viewport coords directly because the glow layer is `fixed`.
      nextX = e.clientX;
      nextY = e.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--mouse-x', `${nextX}px`);
        el.style.setProperty('--mouse-y', `${nextY}px`);
        frame = 0;
      });
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={cn('relative w-full min-h-screen overflow-hidden', className)}>
      {/* Ambient hub-branded cursor glow — fixed to viewport, behind content, ignores pointer events */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(${radius}px circle at var(--mouse-x) var(--mouse-y), ${color}, transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default HubGlowWrapper;
