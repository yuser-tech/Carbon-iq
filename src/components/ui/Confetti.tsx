'use client';

/**
 * Confetti Celebration Component
 * Triggers celebratory confetti animation for milestones
 */

import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

/**
 * Confetti configuration for CarbonIQ theme
 */
const confettiConfig: confetti.Options = {
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 },
  colors: ['#1B5E20', '#4CAF50', '#A5D6A7', '#C9A227', '#F5FFF5'],
  disableForReducedMotion: true,
};

/**
 * Confetti burst configuration for larger celebrations
 */
const burstConfig: confetti.Options = {
  particleCount: 150,
  spread: 100,
  origin: { y: 0.5 },
  colors: ['#1B5E20', '#4CAF50', '#A5D6A7', '#C9A227', '#F5FFF5'],
  ticks: 200,
  gravity: 1.2,
  decay: 0.94,
  startVelocity: 30,
  disableForReducedMotion: true,
};

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Fire confetti celebration
 */
export function celebrateWithConfetti(): void {
  if (prefersReducedMotion()) return;
  
  const defaults = confettiConfig;
  confetti(defaults);
}

/**
 * Fire burst confetti celebration
 */
export function celebrateWithBurst(): void {
  if (prefersReducedMotion()) return;
  
  confetti(burstConfig);
}

/**
 * Fire multiple confetti bursts from different sides
 */
export function celebrateWithSideBurst(): void {
  if (prefersReducedMotion()) return;
  
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#1B5E20', '#4CAF50', '#A5D6A7', '#C9A227', '#F5FFF5'],
  };

  // Fire from left
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: count,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
    });
  }, 0);

  // Fire from right
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: count,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
    });
  }, 100);
}

/**
 * Confetti celebration hook for components
 */
export function useConfetti() {
  const celebrate = useCallback(() => {
    celebrateWithConfetti();
  }, []);

  const celebrateBurst = useCallback(() => {
    celebrateWithBurst();
  }, []);

  const celebrateSide = useCallback(() => {
    celebrateWithSideBurst();
  }, []);

  return { celebrate, celebrateBurst, celebrateSide };
}

/**
 * Confetti celebration component for automatic triggers
 */
export function ConfettiTrigger({
  trigger,
  type = 'default',
  onComplete,
}: {
  trigger: boolean;
  type?: 'default' | 'burst' | 'side';
  onComplete?: () => void;
}) {
  useEffect(() => {
    if (trigger) {
      switch (type) {
        case 'burst':
          celebrateWithBurst();
          break;
        case 'side':
          celebrateWithSideBurst();
          break;
        default:
          celebrateWithConfetti();
      }
      onComplete?.();
    }
  }, [trigger, type, onComplete]);

  return null;
}

export default ConfettiTrigger;
