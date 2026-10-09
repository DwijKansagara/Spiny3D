import React from 'react';
import { useReducedMotion } from 'framer-motion';

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
}

/**
 * Aceternity UI-inspired Border Beam component.
 * Emits an energetic monochromatic/emerald laser ray travelling along card borders.
 * Automatically disabled when prefers-reduced-motion is enabled.
 */
export const BorderBeam: React.FC<BorderBeamProps> = ({
  className = '',
  size = 120,
  duration = 8,
  colorFrom = '#10b981', // Brand emerald
  colorTo = '#06b6d4',   // Cyan highlight (strictly no purple)
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)] ${className}`}
    >
      <div
        className="absolute aspect-square animate-border-beam [animation-direction:normal] [offset-anchor:100%_50%] [offset-path:rect(0_auto_auto_0_round_inherit)]"
        style={{
          width: `${size}px`,
          animationDuration: `${duration}s`,
          background: `linear-gradient(to right, transparent, ${colorFrom}, ${colorTo}, transparent)`,
        }}
      />
    </div>
  );
};
