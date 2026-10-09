import type { Transition } from 'framer-motion';

/**
 * High-performance tactile spring transitions inspired by Josh W. Comeau & Aceternity UI.
 * Pure GPU-accelerated transforms (transform3d, opacity) for 60fps+ rendering.
 */

export const springTactile: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 26,
  mass: 0.8,
};

export const springSlidingPill: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 30,
};

export const springGentle: Transition = {
  type: 'spring',
  stiffness: 280,
  damping: 22,
};

export const springMount: Transition = {
  type: 'spring',
  stiffness: 220,
  damping: 18,
};

export const tactileButtonVariants = {
  initial: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -1 },
  tap: { scale: 0.96, y: 0 },
};

export const reducedMotionVariants = {
  initial: { opacity: 1 },
  hover: { opacity: 0.9 },
  tap: { opacity: 0.8 },
};
