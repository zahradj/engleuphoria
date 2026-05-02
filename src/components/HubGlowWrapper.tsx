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
 * Adapts color based on hubType. Place this around any dark layout
 * to get an ambient cursor-following glow that stays behind content.
 */
const HubGlowWrapper = ({
  hubType = 'Academy',
  className,
  children,
  radius = 600,
}: HubGlowWrapperProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const color = HUB_GLOW_COLOR[hubType];

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    // Center the glow on mount (handles touch devices that never fire mousemove).
    el.style.setProperty('--mouse-x', '50%');
    el.style.setProperty('--mouse-y', '50%');

    let frame = 0;
    let nextX = 0;
    let nextY = 0;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      nextX = e.clientX - rect.left;
      nextY = e.clientY - rect.top;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--mouse-x', `${nextX}px`);
        el.style.setProperty('--mouse-y', `${nextY}px`);
        frame = 0;
      });
    };

    el.addEventListener('mousemove', handleMove);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={cn('relative w-full h-full overflow-hidden', className)}>
      {/* Ambient hub-branded cursor glow — always behind content */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(${radius}px circle at var(--mouse-x) var(--mouse-y), ${color}, transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
};

export default HubGlowWrapper;
